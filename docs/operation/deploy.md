# デプロイ手順

## 概要

本ドキュメントは、portfolio の **staging 環境** および **production 環境** へのデプロイ手順をまとめた運用 Runbook です。

個別の環境構築手順は以下を参照してください。

- [Heroku staging 環境セットアップ手順書](./heroku_staging_setup.md)
- [Heroku production 環境セットアップ手順書](./heroku_production_setup.md)

デプロイ対象の Heroku アプリは次のとおりです。

| 環境 | Heroku アプリ | URL |
|---|---|---|
| staging | `k2works-portfolio-stg` | staging 用 URL |
| production | `k2works-portfolio-prd` | `https://k2works.dpdns.org/` |

---

## 前提条件

- GitHub Actions の Secrets に以下が登録済みであること
  - `HEROKU_API_KEY`
  - `HEROKU_EMAIL`
  - `HEROKU_APP_STAGING=k2works-portfolio-stg`
  - `HEROKU_APP_PRODUCTION=k2works-portfolio-prd`
- Heroku Pipeline `portfolio` が作成済みであること
- `develop` で staging 検証を行い、`main` にマージしてから production へ進めること

---

## staging 環境デプロイ

### 基本方針

- `develop` または `main` への push で GitHub Actions の `Deploy` workflow が起動します。
- `deploy-staging` ジョブが `k2works-portfolio-stg` に `git push` でデプロイします。
- staging は **Basic 認証あり**、`robots.txt` は `Disallow: /` を維持します。

### 手順

1. `develop` ブランチに変更を push します。
2. GitHub Actions の `Deploy` workflow が自動起動することを確認します。
3. `Deploy to Heroku staging` ジョブの成功を確認します。
4. staging 環境で動作確認します。

### GitHub Actions からの手動実行

1. GitHub リポジトリの `Actions` タブを開きます。
2. `Deploy` workflow を選択します。
3. `Run workflow` を押し、`target=staging` を選択します。
4. `develop` または確認したい ref を指定して実行します。

### 確認項目

```bash
heroku releases -a k2works-portfolio-stg
heroku logs --tail -a k2works-portfolio-stg
```

ブラウザまたは `curl` で以下を確認します。

- ホームが Basic 認証付きで開くこと
- `https://staging` 相当の `/healthz` が 200 を返すこと
- `robots.txt` が `Disallow: /` であること

---

## production 環境デプロイ

### 基本方針

production には 2 つのデプロイ方法があります。

1. `production-promote`
   staging で確認済みの slug をそのまま production に昇格します。
2. `production-deploy`
   `main` のソースコードを production 向けに再ビルドして Heroku に直接デプロイします。

本プロジェクトでは `robots.txt` と `sitemap` を production 向けに正しく出す必要があるため、**通常は `production-deploy` を正規経路** とします。

### 推奨手順

1. `develop` で staging 検証を完了します。
2. `develop` を `main` へマージします。
3. GitHub Actions の `Deploy` workflow を `target=production-deploy` で `main` に対して実行します。
4. production 環境の応答を確認します。

### GitHub Actions からの手動実行

1. GitHub リポジトリの `Actions` タブを開きます。
2. `Deploy` workflow を選択します。
3. `Run workflow` を押します。
4. `target=production-deploy` を選択します。
5. `ref=main` を指定して実行します。

### promote を使う場合

`production-promote` は staging と完全に同じ slug をそのまま載せたいときに使います。

1. GitHub リポジトリの `Actions` タブを開きます。
2. `Deploy` workflow を選択します。
3. `Run workflow` を押します。
4. `target=production-promote` を選択します。
5. 実行後に production の挙動を確認します。

> **注意**: `production-promote` では staging ビルド成果物をそのまま昇格するため、環境差分のある `robots.txt` には不向きです。

### 確認項目

```bash
heroku releases -a k2works-portfolio-prd
heroku logs --tail -a k2works-portfolio-prd
curl -I https://k2works.dpdns.org/healthz
curl https://k2works.dpdns.org/robots.txt
```

以下を確認します。

- `https://k2works.dpdns.org/healthz` が `200 OK`
- `https://k2works.dpdns.org/robots.txt` が `Allow: /` を返す
- `Sitemap: https://k2works.dpdns.org/sitemap-index.xml` を含む
- Cloudflare 経由で `server: cloudflare` が返る

---

## ロールバック

production で問題が出た場合は、Heroku release をロールバックします。

```bash
heroku releases -a k2works-portfolio-prd
heroku rollback -a k2works-portfolio-prd
```

特定 release へ戻す場合：

```bash
heroku rollback v<N> -a k2works-portfolio-prd
```

ロールバック後は必ず以下を確認します。

```bash
curl -f https://k2works.dpdns.org/healthz
```

Cloudflare で HTML キャッシュが残っている場合は `Purge Everything` も実施します。

---

## 補足

- staging 自動デプロイは `develop` / `main` push で起動します。
- production デプロイは **手動実行** を前提とします。
- `mkdocs` 側の「← ポートフォリオに戻る」は `https://k2works.dpdns.org/` を指すように運用します。
