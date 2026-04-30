# 通常リリース手順

## 概要

main ブランチへのマージから Heroku staging への自動デプロイ、production への手動 promote までの標準フローを記載します。

> **本書のステータス**: スケルトン（IT-1 完了時点）。コマンド例は IT-2 / v0.1 リリース時に検証して埋めます。

## 前提

- main ブランチに対する push 権限
- GitHub Actions の Secrets に `HEROKU_API_KEY` / `HEROKU_APP_STAGING` / `HEROKU_EMAIL` が設定済み
- Heroku CLI がローカルにインストール済み（緊急時用、通常運用では不要）

## フロー

```text
作業ブランチで開発
    ↓
PR を作成
    ↓
GitHub Actions の CI（lint / test / build / E2E / Lighthouse）が成功
    ↓
PR をセルフレビューして main にマージ
    ↓
GitHub Actions の deploy-staging が自動実行
    ↓
Heroku staging に新リリース反映
    ↓
staging で動作確認
    ↓
GitHub Actions の "promote-to-production" を `workflow_dispatch` で手動実行
    ↓
Heroku production に promote
    ↓
production で /healthz と主要ページ確認
```

## 手順

### 1. 作業ブランチで開発

```bash
git switch -c feature/US-XX-<short-description>
# 実装
git push -u origin feature/US-XX-<short-description>
```

### 2. PR 作成

```bash
gh pr create --base main --title "feat(web): US-XX <title>" --body "..."
```

> PR テンプレートは IT-2 で `.github/PULL_REQUEST_TEMPLATE.md` に整備予定。

### 3. CI 確認

GitHub Actions タブで以下のジョブがすべて成功していることを確認：

- lint-test
- build
- e2e
- lighthouse

失敗時は [トラブルシュート](#トラブルシュート) を参照。

### 4. main へマージ

```bash
gh pr merge --squash --delete-branch
```

### 5. staging で動作確認

`https://staging.portfolio.example.com/` にアクセスし、Basic 認証を入力した上で：

- ホームが表示される
- ヘッダーナビが動作する
- `/healthz` が `ok` を返す

### 6. production への手動 promote

```bash
gh workflow run deploy.yml -f target=production-promote
```

または Heroku CLI で：

```bash
heroku pipelines:promote -a portfolio-staging
```

### 7. production の動作確認

```bash
curl -I https://portfolio.example.com/healthz
# HTTP/2 200
```

UptimeRobot のステータスが green であることも確認。

## トラブルシュート

| 症状 | 対処 |
|---|---|
| CI の lint-test が失敗 | ローカルで `npm run check` を実行し、出力されたエラーを修正 |
| CI の build が失敗 | `npm run build` をローカル再現、Astro / MkDocs のビルドログを確認 |
| CI の e2e が失敗 | Playwright の Trace を artifact からダウンロード、`npx playwright show-trace` で原因特定 |
| CI の lighthouse が予算未達 | バンドル増加・画像未最適化が主因。`astro:assets` を確認 |
| staging で 522（Cloudflare） | Heroku Eco Dyno がスリープ中の可能性。`/healthz` へのリクエストでウォームアップ |
| production promote 後に 5xx | 即時 [rollback.md](./rollback.md) へ |

## 関連

- [rollback.md](./rollback.md)
- [Heroku staging 環境セットアップ手順書](../../docs/operation/heroku_staging_setup.md)
- [運用要件 - 変更管理設計](../../docs/design/operation.md#変更管理設計)
