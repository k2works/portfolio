# プロジェクトドキュメント

プロジェクトで管理しているドキュメントの入口です。採用・営業向けの個人ポートフォリオサイト（Astro SSG + MkDocs / Heroku + Cloudflare）の分析・設計・開発・運用に関する全ドキュメントを集約します。

## まずこれを読もうリスト

- [要件](./requirements/index.md) — RDRA 2.0 ベースで要件を定義します（要件定義書 / ビジネスユースケース / システムユースケース / ユーザーストーリー）。
- [設計](./design/index.md) — アーキテクチャ、モデル、品質方針を整理します（バックエンド / フロントエンド / インフラ / UI / 技術スタック / テスト戦略 / 非機能 / 運用）。
- [開発](./development/index.md) — リリース計画とイテレーション管理の入口です。
- [運用](./operation/index.md) — 環境構築、デプロイ、運用関連の入口です。
- [レビュー](./review/index.md) — 分析・開発レビュー結果の記録です。
- [ADR](./adr/index.md) — 技術的意思決定の記録（7 件）。
- [記事](./article/index.md) — 学習用の記事シリーズの入口です。

## ドキュメント構成

| カテゴリ | 概要 | 状況 |
| :--- | :--- | :--- |
| [要件](./requirements/index.md) | RDRA 2.0 とユースケース整理の入口 | 4 件のドキュメントを配置 |
| [設計](./design/index.md) | アーキテクチャ、モデル、テスト、非機能の整理 | 8 件のドキュメントを配置 |
| [開発](./development/index.md) | リリース計画、イテレーション計画、進捗管理 | リリース計画 + IT-1〜IT-3 報告書 + v0.1 リリース完了報告書を配置 |
| [運用](./operation/index.md) | 環境構築、デプロイ、運用手順の整理 | 2 件のセットアップ手順書を配置 |
| [レビュー](./review/index.md) | 分析・開発レビュー結果の記録 | 1 件（分析成果物レビュー）を配置 |
| [ADR](./adr/index.md) | Architecture Decision Records の管理 | 7 件の ADR を配置 |
| [記事](./article/index.md) | 学習用の記事シリーズ一覧 | `index.md` を整備済み |
| [リファレンス](./reference/index.md) | 開発ガイドラインやベストプラクティス | 30 件のドキュメントを配置 |
| [テンプレート](./template/index.md) | 各種ドキュメントの作成テンプレート | 18 件のテンプレートを配置 |

## カテゴリ別ハイライト

### 要件（4 件）

- [要件定義書](./requirements/requirements_definition.md) — RDRA 4 層、要求モデル R-01〜R-08、機能スコープ
- [ビジネスユースケース](./requirements/business_usecase.md) — BUC-01〜08、3 ペルソナの主要シナリオ
- [システムユースケース](./requirements/system_usecase.md) — UC-01〜15、ストーリー / E2E ID とのトレーサビリティ
- [ユーザーストーリー](./requirements/user_story.md) — US-01〜14（受入条件 76 件）、INVEST 準拠

### 設計（8 件）

- [バックエンドアーキテクチャ](./design/architecture_backend.md) — Heroku Dyno 上の Express 静的配信レイヤー（最小トランザクションスクリプト）
- [フロントエンドアーキテクチャ](./design/architecture_frontend.md) — Astro SSG + Tailwind + Content Collections
- [インフラストラクチャアーキテクチャ](./design/architecture_infrastructure.md) — Heroku Pipeline + Cloudflare 前段配置
- [UI 設計](./design/ui_design.md) — 5 画面 + 補助 2 画面、画面遷移図、salt 図
- [技術スタック](./design/tech_stack.md) — Astro 5 / Node.js 22 / Tailwind 4 / Vitest / Playwright
- [テスト戦略](./design/test_strategy.md) — 逆ピラミッド形 + Lighthouse CI + 静的解析ゲート
- [非機能要件](./design/non_functional.md) — SLO 99.5%、Lighthouse 90+、WCAG 2.1 AA
- [運用要件](./design/operation.md) — 個人運用前提の運用フロー、SEV 別対応、ランブック構成

### 開発

- [リリース計画](./development/release_plan.md) — v0.1（Walking Skeleton）→ v1.0 の 4 段階リリース、想定 10 イテレーション
- [v0.1 リリース完了報告書](./development/release_report-0_1_0.md) — Walking Skeleton（IT-1〜IT-3 / 16 SP / 100%・98.6% 工期短縮）
- [v0.2 リリース完了報告書](./development/release_report-0_2_0.md) — Works（IT-4〜IT-5 / 13 SP / 130%・98.9% 工期短縮）
- [IT-1〜IT-5 完了報告書](./development/index.md) — 各イテレーションの達成 SP / 品質メトリクス / 振り返り
- [IT-6 完了報告書](./development/iteration_report-6.md) — v0.3-α / Skills + ダークモード（IT-6 / 7 SP / 100%・98.9% 工期短縮）
- [IT-7 完了報告書](./development/iteration_report-7.md) — v0.3 リリース / Contact + モバイル仕上げ（IT-7 / 7 SP / 100%・99.4% 工期短縮）
- [v0.3 リリース完了報告書](./development/release_report-0_3_0.md) — Skills + Contact + Dark（IT-6〜IT-7 / 14 SP / 108%・99.3% 工期短縮）
- [IT-8 完了報告書](./development/iteration_report-8.md) — v1.0-α / US-10 A11y 強化（IT-8 / 5 SP / 100%・10.00 SP/h ピーク）

### ADR（7 件）

- [ADR-0001](./adr/0001-frontend-framework-astro.md) — フロントエンドフレームワークに Astro を採用
- [ADR-0002](./adr/0002-hosting-heroku.md) — ホスティングプラットフォームに Heroku を採用
- [ADR-0003](./adr/0003-mkdocs-coexistence-strategy.md) — MkDocs を「Tech Notes」として共存
- [ADR-0004](./adr/0004-cloudflare-front-cdn.md) — Cloudflare 無料プランを前段に配置
- [ADR-0005](./adr/0005-build-pipeline-unification.md) — ビルド境界を GitHub Actions に一本化（**部分置換**: ADR-0007）
- [ADR-0006](./adr/0006-heroku-deploy-authentication.md) — Heroku デプロイの認証は CLI + `~/.netrc` 経由
- [ADR-0007](./adr/0007-mkdocs-independent-delivery.md) — MkDocs を CI から外し GitHub Pages へ独立配信

### レビュー（1 件）

- [分析成果物レビュー（2026-04-30）](./review/design_review_20260430.md) — 5 視点の XP エージェントによる多角レビュー、改善提案 33 件

## 補足

- `operation/` には現在 2 件のセットアップ手順書を配置（`local_setup.md` と `heroku_staging_setup.md`）。production 手順書は v1.0 直前に作成予定です。
- `journal/` は作業ログ用の予約ディレクトリです。
- `assets/` は MkDocs 用のスタイル・スクリプトを格納しています。
