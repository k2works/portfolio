#!/usr/bin/env node
// @ts-check
/**
 * lint-staged から呼び出される ESLint wrapper。
 * apps/web の Flat Config（eslint.config.js）が cwd=apps/web を
 * 期待するため、引数で渡される apps/web 起点の絶対/相対パスから
 * apps/web プレフィックスを剥がし、cwd=apps/web で eslint --fix を
 * 実行する。
 */

import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const webRoot = path.resolve(repoRoot, "apps", "web");

const args = process.argv.slice(2);
if (args.length === 0) {
  process.exit(0);
}

// 受け取ったパスを apps/web 起点の相対パスに正規化する
const filesRelativeToWeb = args.map((arg) => {
  const abs = path.resolve(arg);
  return path.relative(webRoot, abs).replaceAll(path.sep, "/");
});

if (filesRelativeToWeb.length === 0) {
  process.exit(0);
}

// npx 経由で eslint を呼ぶ（npm workspaces で bin が hoist されるため
// apps/web/node_modules/.bin/eslint が存在しないことがある）。
const isWindows = process.platform === "win32";

try {
  execFileSync("npx", ["eslint", "--fix", ...filesRelativeToWeb], {
    cwd: webRoot,
    stdio: "inherit",
    shell: isWindows,
  });
} catch (err) {
  process.exit(typeof err.status === "number" ? err.status : 1);
}
