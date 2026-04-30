# ADR-0002: ホスティングプラットフォームに Heroku を採用する

ポートフォリオサイトおよび MkDocs ドキュメントの公開先として Heroku を採用する。

日付: 2026-04-30

## ステータス

2026-04-30 承認

## コンテキスト

- 静的サイト（SSG）として構築するが、ホスティング先はユーザー指定により Heroku（ヒアリング 4）。
- 採用・営業向けポートフォリオであり、ダウンタイムは可能な限り避けたい。
- 将来的に動的機能（コンタクトフォーム、訪問者数表示等）を後付けする可能性がある。
- 既存 MkDocs サイトとポートフォリオ本体（Astro）を**同一ホストで配信**したい。

候補比較：

| 候補 | 静的サイト適性 | 動的拡張容易性 | Pipeline/Review Apps | 月額コスト | ユーザー希望 |
|---|:---:|:---:|:---:|:---:|:---:|
| **Heroku** | △（Buildpack 必要） | ◎ | ◎ | $5〜$7 | ◎ |
| GitHub Pages | ◎ | ✗ | △ | 無料 | ✗ |
| Cloudflare Pages | ◎ | ○（Workers/Functions） | ○ | 無料 | ✗ |
| Vercel / Netlify | ◎ | ○（Serverless Functions） | ◎ | 無料 | ✗ |
| AWS S3 + CloudFront | ◎ | ○（Lambda 連携必要） | △ | $1〜 | ✗ |

## 決定

Heroku を採用する。

構成：

- staging: **Eco Dyno**（$5/月、スリープあり）
- production: **Basic Dyno**（$7/月、スリープなし、独自ドメイン + 自動 SSL）
- Pipeline で staging → production をプロモート方式で運用
- Buildpack は `heroku/nodejs` + `heroku-community/python`（MkDocs ビルド用）の 2 段構成
- 単一 Dyno 内の Express で Astro 成果物（`/`）と MkDocs 成果物（`/docs`）を同時配信

理由：

1. **ユーザー指定**: 設計判断の前提として尊重する。
2. **動的拡張への移行容易性**: 静的特化 PaaS（GitHub Pages 等）と比べ、コンタクトフォームや軽量 API を Express の同一 Dyno に追加するだけで拡張できる。アーキテクチャ移行コストが小さい。
3. **Pipeline / Review Apps**: PR ごとの一時環境構築が容易で、ステークホルダーに動作確認を依頼しやすい。
4. **MkDocs と Astro の同居**: Buildpack を 2 段構成にすることで、両方を 1 デプロイで配信できる。S3 や GitHub Pages では工夫が必要。

## 影響

### 良い影響

- Pipeline / Review Apps による開発フローの整備が容易。
- 動的機能を追加する際のアーキテクチャ移行コストが低い。
- Heroku Add-on（Papertrail / SendGrid / Postgres）で運用機能を後付けしやすい。

### 悪い影響・リスク

- 静的特化 PaaS と比べ運用コストが高い（最低 $12/月）。GitHub Pages や Cloudflare Pages は無料枠で同等の配信が可能。
- Eco Dyno はスリープがあり、staging のコールドスタートが発生する（許容）。
- Heroku の Common Runtime は単一リージョン構成のため、海外からのレイテンシは CDN を別途検討する必要がある。
- Heroku Router 由来の Cookie / IP 取り扱いに注意（`X-Forwarded-For` の解釈）。

### コスト

| 項目 | 月額 |
|---|---|
| Eco Dyno（staging） | $5 |
| Basic Dyno（production） | $7 |
| **小計** | **$12** |

ドメイン費用、Add-on 費用は別途。

### 取り消し可能性

ビルド成果物は純粋な静的ファイル（HTML/CSS/JS）のため、Heroku から GitHub Pages / Cloudflare Pages / AWS S3+CloudFront への移行は容易。Express の薄い配信レイヤーを廃棄するのみ。乗り換えコストは小。

## コンプライアンス

- `Procfile` と `apps/web/server.js` が存在することを CI で確認する。
- 環境変数 `NODE_ENV` / `LOG_LEVEL` は Heroku Config Vars で管理し、コミットに含めない（`gitleaks` でチェック）。
- staging 環境は Basic 認証 + `robots.txt` で `Disallow: /` とし、本番との混同を防ぐ。
- 死活監視（`/healthz` の 5 分監視）を UptimeRobot で常時動作させる。

## 備考

- 著者: ポートフォリオプロジェクト（k2works/portfolio）
- 関連ドキュメント:
  - [インフラストラクチャアーキテクチャ](../design/architecture_infrastructure.md)
  - [バックエンドアーキテクチャ](../design/architecture_backend.md)
- 再評価のトリガー: 月額コストが $30 を超えた場合、海外トラフィックが 30% を超えた場合、または Heroku の価格改定。
