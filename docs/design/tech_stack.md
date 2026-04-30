# 技術スタック

## 概要

ポートフォリオサイト（Astro SSG）と既存 MkDocs ドキュメントを Heroku 単一 Dyno で配信する構成に対応した技術スタックを定義する。LTS バージョンを優先し、各技術のサポート期限とアップグレード計画を併記する。

選定方針：

- **LTS 優先**: 個人ポートフォリオは長期低頻度メンテのため、サポート期間が長い版を選ぶ
- **エコシステム重視**: 採用例の多い組み合わせ（Astro + Tailwind + Playwright）を選ぶ
- **既存資産の活用**: gulp / dotenv-vault / MkDocs / pymdown-extensions など既に導入済みの資産は維持
- **コスト最小化**: 有償 SaaS は避け、無料枠 / OSS / Heroku Add-on 無料枠で構成

## バックエンド技術スタック（Heroku Dyno 上の静的配信レイヤー）

| カテゴリ | 技術 | バージョン | 用途 | サポート期限 |
|---|---|---|---|---|
| 言語 | Node.js | 22 (Active LTS) | Express 実行ランタイム | 2027-04 |
| フレームワーク | Express | 5.x | 静的配信・将来の API 基盤 | - |
| セキュリティ | helmet | 8.x | セキュリティヘッダ付与 | - |
| ロギング | morgan | 1.x | アクセスログ（stdout） | - |
| 圧縮 | compression | 1.x | gzip / br 圧縮 | - |
| HTTPS 強制 | express-sslify or 自前ミドルウェア | 1.x / N/A | HTTP→HTTPS リダイレクト | - |
| Basic 認証（staging） | express-basic-auth | 1.x | ステージング保護 | - |
| ユニットテスト | Vitest | 2.x | 純関数 / ミドルウェア検証 | - |
| 統合テスト | supertest | 7.x | HTTP エンドポイント検証 | - |

選定理由：

- Node.js 22 は 2027-04 まで Active LTS。Heroku の `heroku/nodejs` Buildpack で公式サポート
- Express 5 は 2024-10 リリースの安定版。`async` ルートのデフォルト対応と Promise 連鎖が改善
- helmet 8 は CSP プリセットを含み Heroku 環境で素直に動作

## フロントエンド技術スタック（Astro SSG）

### コア

| カテゴリ | 技術 | バージョン | 用途 | サポート期限 |
|---|---|---|---|---|
| 言語 | TypeScript | 5.7+ | 型安全な開発 | - |
| フレームワーク | Astro | 5.x | SSG ジェネレーター | - |
| ランタイム（ビルド時） | Node.js | 22 (Active LTS) | Astro ビルド | 2027-04 |
| パッケージマネージャ | npm | 10+（Node.js 22 同梱） | 依存管理、workspaces | - |

### Astro Integrations

| 技術 | バージョン | 用途 |
|---|---|---|
| `@astrojs/check` | 0.9.x | TypeScript 診断 |
| `@astrojs/sitemap` | 3.x | `sitemap.xml` 自動生成 |
| `@astrojs/mdx` | 4.x | MDX サポート |
| `@astrojs/preact` | 4.x | Island としての Preact |
| `astro-icon` | 1.x | SVG アイコン（Iconify） |

### スタイリング

| 技術 | バージョン | 用途 |
|---|---|---|
| Tailwind CSS | 4.x | ユーティリティ CSS |
| `@tailwindcss/vite` | 4.x | Vite/Astro 統合 |
| Iconify Collections | latest | アイコンセット（lucide / simple-icons） |

### コンテンツ・バリデーション

| 技術 | バージョン | 用途 |
|---|---|---|
| Astro Content Collections | Astro 同梱 | Markdown 型検証 |
| Zod | 3.x | スキーマ検証 |
| remark / rehype プラグイン | latest | Markdown 拡張（必要に応じて） |

### テスト・品質

| 技術 | バージョン | 用途 | サポート期限 |
|---|---|---|---|
| Vitest | 2.x | ユニットテスト | - |
| Playwright | 1.49+ | E2E / ビジュアル | - |
| Lighthouse CI | 0.14.x | 性能・SEO・A11y 予算 | - |
| linkinator | 6.x | リンク切れ検出 | - |
| ESLint | 9.x（Flat Config） | 静的解析 | - |
| Prettier | 3.x | フォーマット | - |
| markdownlint-cli2 | 0.15.x | Markdown 静的解析 | - |
| `eslint-plugin-astro` | 1.x | Astro 用 lint ルール | - |

選定理由：

- **Astro 5**: View Transitions、Server Islands を含み、本サイトに直結する SSG 機能が成熟
- **Tailwind CSS 4**: Vite ベースの新エンジンで起動時間が大幅短縮、`@tailwindcss/vite` プラグインで Astro との統合が単純化
- **Playwright**: 公式ブラウザ管理 + スナップショット比較で OS 差を抑える運用が容易
- **Lighthouse CI**: Performance / SEO / A11y を予算化して CI で破壊検出できる

## インフラ技術スタック

### ホスティング・ランタイム

| カテゴリ | 技術 | バージョン | 用途 | サポート期限 |
|---|---|---|---|---|
| PaaS | Heroku | - | Dyno ホスト | - |
| Buildpack | heroku/nodejs | latest | Astro ビルド + Express 起動 | - |
| Buildpack | heroku-community/python | latest | MkDocs ビルド | - |
| Python | 3.12 | 3.12.x | MkDocs 実行 | 2028-10 |

### MkDocs（既存資産の継続利用）

| 技術 | バージョン | 用途 |
|---|---|---|
| MkDocs | 1.6.x | ドキュメント生成 |
| mkdocs-material | 9.x | テーマ |
| pymdown-extensions | 10.x | Markdown 拡張 |
| plantuml-markdown | 3.x | PlantUML レンダリング |

### CI/CD

| カテゴリ | 技術 | バージョン | 用途 | サポート期限 |
|---|---|---|---|---|
| パイプライン | GitHub Actions | - | CI / CD | - |
| アクション | `actions/checkout` | v4 | チェックアウト | - |
| アクション | `actions/setup-node` | v4 | Node.js セットアップ | - |
| アクション | `actions/setup-python` | v5 | Python セットアップ（MkDocs 用） | - |
| アクション | `actions/upload-artifact` | v4 | ビルド成果物保管 | - |
| アクション | `treosh/lighthouse-ci-action` | v12 | Lighthouse CI 実行 | - |
| デプロイ | Heroku CLI | latest | パイプラインプロモート | - |
| 認証 | OIDC + Heroku API Key | - | Heroku 認証 | - |
| シークレット | GitHub Encrypted Secrets | - | API キー保管 | - |

### 監視・運用

| カテゴリ | 技術 | バージョン | 用途 | 備考 |
|---|---|---|---|---|
| ログ収集 | Heroku Logplex | 標準 | stdout 集約 | 標準機能 |
| ログ保管 | Papertrail Add-on | Choklad（無料） | 7 日保持 | $0 |
| メトリクス | Heroku Metrics | 標準 | Dyno 指標 | Basic Dyno で利用可 |
| 死活監視 | UptimeRobot | 無料枠 | 5 分間隔 | $0 |
| Web Vitals | Lighthouse CI | 0.14.x | CI 内測定 | - |
| 簡易アクセス解析 | Plausible / Cloudflare Web Analytics | - | Cookieless | 任意（要件追加時） |
| エラートラッキング | Sentry（任意） | 8.x | クライアント・サーバ両用 | 動的拡張時に導入 |

### IaC

| カテゴリ | 技術 | バージョン | 用途 | サポート期限 |
|---|---|---|---|---|
| IaC | Terraform | 1.10+ | Heroku リソース管理 | - |
| Provider | `heroku/heroku` | 5.x | Heroku Provider | - |
| 静的解析 | tflint | 0.55+ | Terraform 静的解析 | - |
| シークレットスキャン | gitleaks | 8.x | シークレット漏洩検出 | - |

### セキュリティ・依存管理

| カテゴリ | 技術 | バージョン | 用途 |
|---|---|---|---|
| 依存更新 | Dependabot | GitHub 標準 | 依存自動更新 PR |
| 脆弱性スキャン | `npm audit` | npm 同梱 | 本番依存スキャン |
| Heroku ACM | Automated Certificate Management | 標準 | TLS 証明書自動管理 |

## 開発ツール（リポジトリ共通）

| カテゴリ | 技術 | バージョン | 用途 | 備考 |
|---|---|---|---|---|
| タスクランナー | Gulp | 5.x | 既存運用タスク（mkdocs / vault / journal） | 既存資産 |
| 環境変数 | dotenv | 17.x | ローカル `.env` 読み込み | 既存資産 |
| 環境変数共有 | dotenv-vault | latest | `.env.vault` での暗号化共有 | 既存資産 |
| Dev Container | devcontainer | - | VS Code / Cursor 開発環境 | 既存資産 |
| Nix | flake | - | 再現可能な開発環境 | 既存資産 |
| Docker | Docker Desktop | latest | MkDocs ローカル実行 | 既存 `ops/docker/mkdoc/Dockerfile` |
| Git Hook | husky / lefthook（任意） | latest | コミット前 lint | 必要に応じて |

## ディレクトリ別の技術配置

| ディレクトリ | 主要技術 |
|---|---|
| `apps/web/` | Node.js 22 / Astro 5 / TypeScript / Tailwind 4 / Vitest / Playwright / Express |
| `docs/` | Markdown / PlantUML |
| `ops/docker/mkdoc/` | Python 3.11 + MkDocs（ローカル開発用、本番 Heroku は 3.12） |
| `ops/scripts/` | gulp タスク（dotenv-vault, journal 生成, mkdocs ラッパ） |
| `ops/terraform/`（将来） | Terraform 1.10 + heroku-provider |

## バージョン管理方針

### Node.js

- **採用**: Node.js 22（Active LTS / 2027-04 EOL）
- **管理**: `package.json` の `engines.node` に `>=22 <23` を指定し、Heroku でも同バージョンを利用
- **アップグレード**: 24 LTS リリース後（2025-10 予定）に評価。LTS 移行は EOL 6 ヶ月前を目安に実施

### TypeScript

- **採用**: 最新安定版（5.7 系以降）
- **管理**: 厳格モード（`strict: true`）、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes` を有効化
- **アップグレード**: マイナーリリース（3 ヶ月毎）ごとに更新

### Astro

- **採用**: 5.x（最新メジャー）
- **管理**: `astro check` を CI に組込み、API の破壊的変更を即時検出
- **アップグレード**: マイナーは即追従、メジャーは Migration Guide 確認後に実施

### Python（MkDocs 用）

- **採用**: 3.12（Heroku で安定、2028-10 EOL）
- **管理**: `runtime.txt` に `python-3.12.x` を記載
- **既存 Dockerfile**: `ops/docker/mkdoc/Dockerfile` は 3.11-slim だが、Heroku 本番は 3.12 を採用。ローカル/本番のずれは `requirements.txt` で吸収

### Heroku

- **採用**: 現行 Stack（heroku-24 が登場次第移行）
- **管理**: `heroku stack` で確認、年次で見直す

## アップグレード計画

| 時期 | 対象 | 内容 |
|---|---|---|
| 四半期ごと | npm 依存 | Dependabot PR をまとめてマージ、E2E で検証 |
| 半期ごと | Astro / Tailwind / Playwright | メジャー版を評価、Migration Guide 確認 |
| 年次 | Node.js / Python / Heroku Stack | EOL 6 ヶ月前までに次バージョンへ移行 |
| 都度 | セキュリティパッチ | `npm audit fix --production` を CI で検知し、即対応 |

## 採否一覧（要件と整合）

| 候補 | 採否 | 理由 |
|---|:---:|---|
| Next.js (SSG) | ✗ | App Router の複雑さがオーバーヘッド、SSG 用途では Astro が優位（[ADR-0001](../adr/0001-frontend-framework-astro.md)） |
| SvelteKit (static) | ✗ | エコシステム成熟度・MDX 統合で Astro に劣る |
| Hugo / Jekyll | ✗ | 動的拡張時の選択肢が限定 |
| Redux / Jotai | ✗ | 静的サイトに状態管理は不要 |
| GraphQL | ✗ | API そのものが現状不要 |
| Heroku Postgres | ✗（保留） | 永続化要件なし。動的拡張時に Mini Add-on を導入 |
| AWS S3 + CloudFront | ✗ | ユーザー希望が Heroku（[ADR-0002](../adr/0002-hosting-heroku.md)） |
| Cloudflare Pages | ✗ | 同上 |

## 関連ドキュメント

- [バックエンドアーキテクチャ](./architecture_backend.md)
- [フロントエンドアーキテクチャ](./architecture_frontend.md)
- [インフラストラクチャアーキテクチャ](./architecture_infrastructure.md)
- [UI 設計](./ui_design.md)
- [ADR-0001: フロントエンドフレームワークに Astro を採用](../adr/0001-frontend-framework-astro.md)
- [ADR-0002: ホスティングプラットフォームに Heroku を採用](../adr/0002-hosting-heroku.md)
