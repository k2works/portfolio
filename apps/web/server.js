// @ts-check
/**
 * Heroku Dyno 上の Express 静的配信プロセス。
 *
 * 設計詳細: docs/design/architecture_backend.md
 * Cloudflare 前段配置: docs/adr/0004-cloudflare-front-cdn.md
 * ビルド境界: docs/adr/0005-build-pipeline-unification.md
 */

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT ?? 3000;
const distDir = path.resolve(__dirname, "dist");
const isProduction = process.env.NODE_ENV === "production";

// Heroku Router / Cloudflare の前段を信頼
app.set("trust proxy", true);

// HTTPS 強制（Cloudflare の常時 HTTPS との保険的二重化）
app.use((req, res, next) => {
  if (isProduction && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Basic 認証（staging のみ。BASIC_AUTH_USER と BASIC_AUTH_PASS が両方
// 設定されている場合に有効化）
const basicAuthUser = process.env.BASIC_AUTH_USER;
const basicAuthPass = process.env.BASIC_AUTH_PASS;
if (basicAuthUser && basicAuthPass) {
  app.use((req, res, next) => {
    if (req.path === "/healthz") return next();
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Basic ")) {
      res.set("WWW-Authenticate", 'Basic realm="staging"');
      return res.status(401).send("Authentication required");
    }
    const decoded = Buffer.from(auth.slice(6), "base64").toString();
    const sep = decoded.indexOf(":");
    const user = sep >= 0 ? decoded.slice(0, sep) : decoded;
    const pass = sep >= 0 ? decoded.slice(sep + 1) : "";
    if (user !== basicAuthUser || pass !== basicAuthPass) {
      res.set("WWW-Authenticate", 'Basic realm="staging"');
      return res.status(401).send("Invalid credentials");
    }
    next();
  });
}

// セキュリティヘッダ
// - HSTS は Cloudflare 側で付与するため Express 側は無効化
// - CSP は Astro Islands の inline script を許可
// - frame-src: ALU 公式コマ埋め込み（https://alu.jp）を許可
app.use(
  helmet({
    strictTransportSecurity: false,
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'"],
        "connect-src": ["'self'"],
        "frame-src": ["'self'", "https://alu.jp"],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
      },
    },
  })
);

app.use(morgan("combined"));

// ヘルスチェック（Heroku Router / Cloudflare / UptimeRobot 共通）
app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

// 静的アセットは immutable で 1 年キャッシュ
app.use(
  "/assets",
  express.static(path.join(distDir, "assets"), {
    maxAge: "365d",
    immutable: true,
  })
);

// HTML は no-cache（エッジで短時間キャッシュされる）
app.use(
  express.static(distDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "public, no-cache");
      }
    },
  })
);

// 404 ページ（Astro が出力する 404.html があればそれを使用、なければ既定文言）
app.use((_req, res) => {
  const fallback = path.join(distDir, "404.html");
  res
    .status(404)
    .type("html")
    .sendFile(fallback, (err) => {
      if (err) {
        res.status(404).type("text/plain").send("404 Not Found");
      }
    });
});

const server = app.listen(port, () => {
   
  console.log(`listening on ${port}`);
});

// Graceful shutdown
/** @param {NodeJS.Signals} signal */
const shutdown = (signal) => {
   
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    process.exit(0);
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
