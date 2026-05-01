# 運用

開発環境構築・デプロイ・運用に関するドキュメントです。

## ドキュメント一覧

### 環境セットアップ

| ドキュメント | 概要 | 状況 |
| :--- | :--- | :--- |
| [アプリケーション開発環境セットアップ手順書](./local_setup.md) | ローカル開発環境（Node.js 22 + Astro + MkDocs Docker + Gulp） | 作成済み |
| [Heroku staging 環境セットアップ手順書](./heroku_staging_setup.md) | Heroku Pipeline + Eco Dyno + Cloudflare 前段 + GitHub Actions CI/CD | 作成済み |
| Heroku production 環境セットアップ手順書 | Basic Dyno + 独自ドメイン + Always Online + UptimeRobot | 未作成（v1.0 直前に作成） |

> AWS テンプレート（`docs/template/AWS*セットアップ手順書.md`）は将来的な AWS 移行時の参照として温存しています。本プロジェクトでは Heroku を採用するため使用しません（[ADR-0002](../adr/0002-hosting-heroku.md)）。

### 運用コマンド

運用コマンドのリファレンスを追加予定です（`gulp` タスク、`heroku` CLI 等）。

### アクセシビリティ運用

| ドキュメント | 概要 | 状況 |
| :--- | :--- | :--- |
| [アクセシビリティ手動検証手順](./a11y_manual_check.md) | NVDA / VoiceOver による読み上げ順序・ランドマーク・フォーカス検証手順 | 作成済み（IT-8）|

### インフラ

インフラ構成の詳細は [インフラストラクチャアーキテクチャ](../design/architecture_infrastructure.md) と [運用要件](../design/operation.md) を参照。

## 補足

- 段階的に手順書を整備中。`production_setup.md` は v1.0 リリース直前に作成予定。
- テンプレートとは構造が異なる Heroku 環境向け手順書を新規作成しています。
