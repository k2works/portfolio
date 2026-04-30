# ADR (Architecture Decision Records)

技術的意思決定を記録した ADR です。

## ADR 一覧

| ADR | 決定内容 | ステータス |
| :--- | :--- | :--- |
| [ADR-0001](./0001-frontend-framework-astro.md) | フロントエンドフレームワークに Astro を採用 | 承認（2026-04-30） |
| [ADR-0002](./0002-hosting-heroku.md) | ホスティングプラットフォームに Heroku を採用 | 承認（2026-04-30） |
| [ADR-0003](./0003-mkdocs-coexistence-strategy.md) | MkDocs を「Tech Notes」として共存させ、初期は noindex で公開 | 承認（2026-04-30） |
| [ADR-0004](./0004-cloudflare-front-cdn.md) | Cloudflare 無料プランを初期構成から前段に配置 | 承認（2026-04-30） |
| [ADR-0005](./0005-build-pipeline-unification.md) | ビルド境界を GitHub Actions に一本化、Heroku は Slug 受領のみ | 承認（2026-04-30） |

ADR の作成には `creating-adr` スキルを使用してください。
