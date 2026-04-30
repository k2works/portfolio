# アプリケーション開発環境セットアップ手順書

## 概要

本ドキュメントは、**portfolio**（採用・営業向け個人ポートフォリオサイト）のローカル開発環境をセットアップする手順を説明します。

テスト駆動開発（TDD）のゴールは **動作するきれいなコード** です。それを実現するためには [ソフトウェア開発の三種の神器](https://t-wada.hatenablog.jp/entry/clean-code-that-works) が必要です。

> 今日のソフトウェア開発の世界において絶対になければならない 3 つの技術的な柱があります。三本柱と言ったり、三種の神器と言ったりしていますが、それらは
>
> - バージョン管理
> - テスティング
> - 自動化
>
> の 3 つです。

---

## 1. 前提条件

以下のツールがインストールされていることを確認してください。

| ツール | バージョン | 確認コマンド |
|--------|-----------|-------------|
| Node.js | 22.x LTS | `node -v` |
| npm | 10.x | `npm -v` |
| Python | 3.12.x | `python --version`（MkDocs 用） |
| Docker Desktop | 最新 | `docker -v` |
| Docker Compose | v2.x | `docker compose version` |
| Git | 最新 | `git -v` |
| Heroku CLI | 最新（任意） | `heroku --version` |

### Node.js のインストール

Node.js 22 LTS（[ADR-0005](../adr/0005-build-pipeline-unification.md) で採用）をインストールします。バージョン管理には **Volta** または **fnm** を推奨。

```bash
# Volta（Windows / macOS）
volta install node@22

# fnm
fnm install 22
fnm use 22

# バージョン確認
node -v   # v22.x
npm -v    # 10.x
```

公式ダウンロード: https://nodejs.org/

### Python のインストール（MkDocs 用）

MkDocs（[Tech Notes](../adr/0003-mkdocs-coexistence-strategy.md)）のローカルビルドに使用します。

```bash
# Windows（Scoop）
scoop install python

# macOS（Homebrew）
brew install python@3.12

# バージョン確認
python --version   # Python 3.12.x
```

### Docker Desktop のインストール

MkDocs ローカルサーバー（`ops/docker/mkdoc/Dockerfile`）の起動に使用します。

- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **macOS**: https://docs.docker.com/desktop/install/mac-install/

```bash
# バージョン確認
docker -v
docker compose version
```

### Heroku CLI（任意）

ローカルから Heroku の状態確認・緊急ロールバックに使用します。CI 経由デプロイが基本のため必須ではありません。

```bash
# Windows（Scoop）
scoop install heroku-cli

# macOS（Homebrew）
brew tap heroku/brew && brew install heroku

# 認証
heroku login
```

---

## 2. プロジェクトの取得

### リポジトリのクローン

```bash
git clone https://github.com/k2works/portfolio.git
cd portfolio
```

### Node.js 依存パッケージのインストール

```bash
npm install
```

ルートには gulp / dotenv 等の運用タスクの依存が含まれます。`apps/web/` は v0.1 開発時に追加します。

### 環境変数の設定

```bash
# テンプレートをコピー
cp .env.example .env

# .env を編集（個人開発用の値を設定）
```

`.env` の主な変数：

```dotenv
# MkDocs ローカルサーバー
MKDOCS_PORT=8000

# 将来的に追加する変数
# HEROKU_API_KEY=（CI 用）
```

詳細は [環境変数管理ガイド](../reference/環境変数管理ガイド.md) を参照。`.env` は git 管理外、共有は `.env.vault`（dotenv-vault）で行います。

---

## 3. サブシステム一覧

portfolio は単一の Heroku Dyno で 2 種類の成果物を配信します（[ADR-0005](../adr/0005-build-pipeline-unification.md)）。

| サブシステム | ディレクトリ | 説明 | ローカルポート |
|---|---|---|---|
| ポートフォリオ（Astro） | `apps/web/` | Astro 5 SSG + Express 5 配信 | 4321（dev）/ 3000（preview） |
| Tech Notes（MkDocs） | `docs/`（ソース）→ `apps/web/dist/docs/`（ビルド成果物） | MkDocs Material | 8000（Docker） |

---

## 4. 技術スタック

### フロントエンド（Astro）

| カテゴリ | 技術 | バージョン |
|---|---|---|
| 言語 | TypeScript | 5.7+ |
| フレームワーク | Astro | 5.x |
| Integrations | `@astrojs/check` / `@astrojs/sitemap` / `@astrojs/mdx` / `@astrojs/preact` / `astro-icon` | latest |
| CSS | Tailwind CSS | 4.x |
| Vite プラグイン | `@tailwindcss/vite` | 4.x |
| バリデーション | Zod | 3.x |

### バックエンド（Heroku 配信レイヤー）

| カテゴリ | 技術 | バージョン |
|---|---|---|
| ランタイム | Node.js | 22 LTS |
| フレームワーク | Express | 5.x |
| セキュリティ | helmet | 8.x |
| ロギング | morgan | 1.x |
| ユニット | Vitest | 2.x |
| 統合 | supertest | 7.x |
| E2E | Playwright | 1.49+ |
| Lighthouse | Lighthouse CI | 0.14.x |

### Tech Notes（MkDocs）

| カテゴリ | 技術 | バージョン |
|---|---|---|
| ランタイム | Python | 3.12 |
| ジェネレーター | MkDocs | 1.6.x |
| テーマ | mkdocs-material | 9.x |
| 拡張 | pymdown-extensions / plantuml-markdown | latest |

### 開発ツール（リポジトリ共通）

| カテゴリ | 技術 | バージョン |
|---|---|---|
| タスクランナー | Gulp | 5.x |
| 環境変数 | dotenv | 17.x |
| 環境変数共有 | dotenv-vault | latest |
| Lint | ESLint 9（Flat Config） / Prettier 3 / markdownlint-cli2 / eslint-plugin-astro | latest |

詳細は [技術スタック](../design/tech_stack.md) を参照。

---

## 5. プロファイル構成

ローカル開発は素早いフィードバックを優先します。Docker は MkDocs の確認時のみ起動します。

| プロファイル | 起動方法 | 用途 |
|---|---|---|
| dev（推奨） | `npm run dev` | Astro dev server（HMR）。日常開発 |
| preview | `npm run build && npm run preview` | 本番相当の確認（SSG ビルド成果物を配信） |
| docs | `npm run docs:serve` | MkDocs ローカル確認（Docker） |
| full | preview + docs を Express で統合 | Heroku 本番相当の確認 |

---

## 6. 開発サーバーの起動

### 日常開発（Astro HMR、推奨）

```bash
cd apps/web
npm run dev
# http://localhost:4321 で確認
```

### MkDocs ローカル確認

```bash
# プロジェクトルートで
npm run docs:serve
# http://localhost:8000 で確認
```

停止：

```bash
npm run docs:stop
```

### Heroku 本番相当の確認（preview + Express）

```bash
# 1. ビルド（CI と同じ手順）
cd apps/web
npm run build

# 2. MkDocs ビルドして dist/docs/ に配置
cd ../..
npm run docs:build

# 3. Express で配信（apps/web/server.js）
cd apps/web
NODE_ENV=production node server.js
# http://localhost:3000 で確認
```

### TDD モード（テスト自動再実行）

```bash
cd apps/web
npm run test:watch
```

### アクセス確認

| サービス | URL | 説明 |
|---|---|---|
| Astro dev | http://localhost:4321 | HMR 付き開発サーバー |
| Astro preview | http://localhost:3000 | Express + ビルド成果物 |
| MkDocs | http://localhost:8000 | Tech Notes ローカル確認 |
| ヘルスチェック | http://localhost:3000/healthz | preview 起動時のみ |

---

## 7. Docker による MkDocs サーバー

ルートの `gulpfile.js` 経由で Docker Compose を起動します（`ops/docker/mkdoc/Dockerfile`）。

```bash
# 起動
npm run docs:serve

# 停止
npm run docs:stop

# ビルドのみ（成果物を ./site/ または apps/web/dist/docs/ に出力）
npm run docs:build

# Docker 直接コマンド
docker compose up -d mkdoc
docker compose ps
docker compose logs -f mkdoc
docker compose down
```

---

## 8. テストの実行

### 全テスト実行

```bash
cd apps/web

# 静的解析（ゲート）
npm run typecheck      # tsc + astro check
npm run lint           # ESLint
npm run format:check   # Prettier

# ユニット + 統合
npm test               # Vitest（カバレッジ付き）

# E2E
npm run test:e2e       # Playwright
```

### テストの種類（[テスト戦略](../design/test_strategy.md)）

| テスト種別 | ツール | 説明 | 配分 |
|---|---|---|---:|
| 静的解析 | tsc / astro check / ESLint / Prettier | ゲート | - |
| ユニット | Vitest | 純関数 / Express ミドルウェア | 10% |
| 統合 | supertest / astro build | ルーティング / Content Collections | 20% |
| Lighthouse | Lighthouse CI | 性能・SEO・A11y 予算 | 15% |
| E2E | Playwright | UI シナリオ E01〜E12 | 55% |

### Lighthouse CI のローカル実行

```bash
cd apps/web
npm run lhci         # apps/web/dist に対して実行
```

---

## 9. コード品質管理

### 静的解析ツール

| ツール | 目的 | コマンド |
|---|---|---|
| TypeScript / astro check | 型検査 | `npm run typecheck` |
| ESLint（Flat Config）+ eslint-plugin-astro | コーディング規約 | `npm run lint` |
| Prettier | フォーマット | `npm run format` |
| markdownlint-cli2 | Markdown 検証 | `npm run lint:md` |
| gitleaks | シークレット漏洩検出 | `gitleaks detect` |

### 品質チェックの一括実行

```bash
cd apps/web
npm run check         # lint + typecheck + format:check + test
```

### コード品質の基準（[非機能要件](../design/non_functional.md)）

| 指標 | 閾値 |
|---|---|
| TypeScript エラー | 0 |
| ESLint エラー | 0 |
| Prettier 違反 | 0 |
| 循環的複雑度 | 関数あたり < 10 |
| ファイル長 | < 300 行 |
| 関数長 | < 50 行 |

### Lighthouse 予算（v0.1 段階導入）

| バージョン | Performance | SEO | Accessibility |
|---|---:|---:|---:|
| v0.1 | ≥ 80 | ≥ 90 | ≥ 90 |
| v1.0 | ≥ 90 | ≥ 95 | ≥ 95 |

詳細は [リリース計画](../development/release_plan.md) を参照。

---

## 10. ディレクトリ構造

```text
portfolio/
├── .agents/                      # Claude Code エージェント定義
├── .claude/                      # Claude Code 設定
├── .devcontainer/                # Dev Container
├── .github/                      # GitHub Actions（v0.1 で追加）
├── .husky/                       # Git Hooks（任意・後付け）
├── apps/
│   └── web/                      # Astro + Express（v0.1 で作成）
│       ├── astro.config.mjs
│       ├── package.json
│       ├── public/               # 静的アセット
│       ├── src/
│       │   ├── components/       # 再利用 UI
│       │   ├── layouts/          # BaseLayout 等
│       │   ├── pages/            # ファイルベースルーティング
│       │   ├── content/          # Markdown コンテンツ
│       │   │   ├── works/
│       │   │   └── posts/
│       │   ├── styles/           # Tailwind 設定 + グローバル CSS
│       │   └── utils/
│       ├── server.js             # Heroku 用 Express
│       ├── lighthouserc.json
│       ├── playwright.config.ts
│       └── tests/
│           ├── unit/
│           ├── integration/
│           └── e2e/
├── docs/                         # ドキュメント（Markdown ソース）
│   ├── adr/                      # ADR
│   ├── design/                   # 設計成果物
│   ├── requirements/             # 要件定義
│   ├── development/              # リリース計画
│   ├── operation/                # 運用要件・本書
│   ├── reference/                # リファレンス
│   ├── review/                   # レビュー結果
│   ├── article/                  # 学習記事
│   └── template/                 # テンプレート
├── ops/
│   ├── docker/mkdoc/             # MkDocs Docker
│   ├── nix/                      # Nix flake
│   ├── scripts/                  # gulp タスク（dotenv-vault 等）
│   ├── runbook/                  # 運用 runbook（v0.1 で骨格作成）
│   └── terraform/                # Heroku IaC（将来）
├── flake.nix                     # Nix shell
├── flake.lock
├── docker-compose.yml            # MkDocs ローカル
├── gulpfile.js                   # 既存運用タスク
├── package.json                  # ルート（gulp / dotenv）
├── mkdocs.yml                    # MkDocs 設定
├── Procfile                      # Heroku（v0.1 で作成）
├── runtime.txt                   # Heroku Python（廃止予定 / ADR-0005）
└── README.md
```

---

## 11. 命名規則

| 要素 | 規則 | 例 |
|---|---|---|
| ファイル名（Astro） | kebab-case + 拡張子 | `work-card.astro` |
| Astro コンポーネント | PascalCase | `WorkCard` |
| 関数 / 変数 | camelCase | `formatDate` |
| 型 | PascalCase | `WorkSchema` |
| 定数 | UPPER_SNAKE_CASE | `MAX_FEATURED_WORKS` |
| Markdown スラッグ | kebab-case | `apps/web/src/content/works/work-a.md` |
| ブランチ | `feature/<US-ID>-<短い説明>` | `feature/US-01-hero-section` |

---

## 12. Git 規約

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/ja/) に従います。日本語で本文を書きます。

| タイプ | 説明 |
|---|---|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみ |
| `style` | フォーマット |
| `refactor` | リファクタリング |
| `perf` | パフォーマンス改善 |
| `test` | テストの追加・修正 |
| `chore` | ビルド・補助ツール |

### スコープ

| スコープ | 対象 |
|---|---|
| `web` | `apps/web/`（Astro + Express） |
| `docs` | `docs/` 配下のドキュメント全般 |
| `ops` | `ops/` 配下の運用スクリプト・IaC |
| `mkdocs` | `mkdocs.yml` |
| `gitignore` | `.gitignore` |
| `adr` | `docs/adr/` |
| `requirements` | `docs/requirements/` |
| `design` | `docs/design/` |
| `review` | `docs/review/` |
| `development` | `docs/development/` |

### Git Hooks（v0.1 リリースまでに追加）

`apps/web/package.json` に husky + lint-staged を追加し、pre-commit で以下を実行：

| ツール | 目的 |
|---|---|
| Prettier | フォーマット適用（`--write`） |
| ESLint | コーディング規約検証 |
| markdownlint-cli2 | Markdown 検証（`docs/**/*.md` と PR に含まれる Markdown） |

緊急時のスキップ：

```bash
git commit --no-verify -m "メッセージ"
```

> **Warning**: フックスキップは緊急時のみ。CI でも検証されるため push 後に失敗する可能性があります。

---

## 13. セットアップの確認

すべて整ったら以下で動作確認：

```bash
# 1. ルートの依存
npm install

# 2. apps/web セットアップ（v0.1 着手後）
cd apps/web
npm install

# 3. 静的解析
npm run check

# 4. テスト
npm test

# 5. ビルド
npm run build

# 6. preview 起動
NODE_ENV=production node server.js
# 別ターミナルで MkDocs を起動
cd ../..
npm run docs:serve
```

### アクセス確認

| サービス | URL |
|---|---|
| Astro dev | http://localhost:4321 |
| Astro preview（Express） | http://localhost:3000 |
| ヘルスチェック | http://localhost:3000/healthz |
| MkDocs | http://localhost:8000 |

---

## 14. CI/CD（参考）

CI/CD の実体は v0.1 で構築します。詳細は [Heroku staging 環境セットアップ手順書](./heroku_staging_setup.md) を参照。

| ワークフロー | ファイル | トリガー | 内容 |
|---|---|---|---|
| Backend CI | `.github/workflows/ci.yml` | PR / push | lint / typecheck / test / build / E2E / Lighthouse CI |
| Heroku Deploy | `.github/workflows/deploy.yml` | main 経由で staging、`workflow_dispatch` で production プロモート | Heroku Container Registry へ push（[ADR-0005](../adr/0005-build-pipeline-unification.md)） |

---

## トラブルシューティング

### `npm install` が遅い / 失敗する

| 原因 | 対処 |
|---|---|
| ネットワーク不安定 | `npm install --prefer-offline` |
| Node バージョン不一致 | `.nvmrc` または `engines.node` を確認、`fnm use` |
| キャッシュ破損 | `rm -rf node_modules package-lock.json && npm install` |

### `npm run docs:serve` で 8000 番が使えない

```bash
# 既存プロセスを確認
docker compose ps
# 強制終了
npm run docs:stop
# Windows: ポート使用プロセスを kill
netstat -ano | findstr :8000
```

詳細は [`killing-processes` スキル](../../.claude/skills/killing-processes/SKILL.md) を参照。

### Astro の HMR が反映されない

```bash
# キャッシュクリア
rm -rf apps/web/.astro apps/web/dist apps/web/node_modules/.vite
cd apps/web
npm install
npm run dev
```

### Python / MkDocs のバージョン差異（Docker は 3.11、Heroku は 3.12）

開発時は Docker（3.11-slim）を使用し、本番ビルドは GitHub Actions の Python 3.12 で実行（[ADR-0005](../adr/0005-build-pipeline-unification.md)）。`requirements.txt` でバージョン差異を吸収します。

### pre-commit フックが失敗する場合

```bash
cd apps/web
npm run check
# 出力されたエラーを修正してから再コミット
```

### `.env` の取り扱い

- `.env` は git 管理外（`.gitignore` 済み）
- `.env.example` をテンプレートとして使用
- 共有は `.env.vault`（dotenv-vault）。詳細は [環境変数管理ガイド](../reference/環境変数管理ガイド.md) と `npm run vault:*` タスク

---

## 関連ドキュメント

- [Heroku staging 環境セットアップ手順書](./heroku_staging_setup.md) — 次の段階
- [運用要件](../design/operation.md)
- [非機能要件](../design/non_functional.md)
- [リリース計画](../development/release_plan.md)
- [技術スタック](../design/tech_stack.md)
- [ADR-0005: ビルド境界を GitHub Actions に一本化](../adr/0005-build-pipeline-unification.md)
- [環境変数管理ガイド](../reference/環境変数管理ガイド.md)
