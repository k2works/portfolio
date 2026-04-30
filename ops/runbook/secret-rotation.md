# シークレットローテーション手順

## 概要

90 日ごとに `HEROKU_API_KEY` / `BASIC_AUTH_USER/PASS` などの認証情報を交換するための手順です。

> **本書のステータス**: スケルトン（IT-2 で配置）。最初のローテーション実施時に手順を磨き込みます。

## 対象シークレット

| シークレット | 保管先 | ローテーション頻度 |
|---|---|---|
| `HEROKU_API_KEY` | GitHub Secrets / `~/.netrc` | 90 日 |
| `BASIC_AUTH_USER` | Heroku Config Vars（staging） | 90 日（または漏洩疑い時） |
| `BASIC_AUTH_PASS` | 同上 | 90 日 |
| Cloudflare API Token（v1.0+ で IaC 化時） | GitHub Secrets | 90 日 |
| Heroku Account のパスワード / 2FA バックアップコード | パスワードマネージャ | 1 年 |

## カレンダー設定

毎四半期（1月初、4月初、7月初、10月初）の月初にローテーションを実施。GitHub Issue を年次で 4 件起票（または `gulp` タスクで自動 Issue 生成、IT-3 検討）。

## 手順

### A. `HEROKU_API_KEY`

1. **新トークン発行**

   ```bash
   heroku authorizations:create -d "GitHub Actions for portfolio - $(date +%Y-%m)"
   # Token: <new_token> をコピー
   ```

2. **GitHub Secrets を更新**

   ```bash
   gh secret set HEROKU_API_KEY --body "<new_token>" --repo k2works/portfolio
   ```

   または GitHub UI: Settings → Secrets → `HEROKU_API_KEY` を Edit。

3. **動作確認**

   - `gh workflow run deploy.yml` を実行
   - GitHub Actions が新しいトークンで認証成功することを確認

4. **旧トークン削除**

   ```bash
   heroku authorizations
   # 旧トークンの ID を確認
   heroku authorizations:revoke <old_id>
   ```

### B. `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`（staging）

1. **新しい credentials を生成**

   ```bash
   # macOS / Linux / Git Bash
   USER="staging-$(date +%Y%m%d)"
   PASS=$(openssl rand -base64 24)
   echo "USER=$USER"
   echo "PASS=$PASS"
   ```

2. **Heroku Config Vars を更新**

   ```bash
   heroku config:set BASIC_AUTH_USER="$USER" -a portfolio-staging
   heroku config:set BASIC_AUTH_PASS="$PASS" -a portfolio-staging
   ```

3. **動作確認**

   ```bash
   curl -u "$USER:$PASS" https://staging.portfolio.example.com/
   # 200 を確認
   curl -u "wrong:credentials" https://staging.portfolio.example.com/ -I | head -3
   # 401 を確認
   ```

4. **新 credentials をパスワードマネージャに保管**

   個人用 1Password / Bitwarden 等に保管。チーム化した場合は共有 Vault に。

### C. Heroku アカウントパスワード / 2FA

1. パスワードマネージャで強度チェック
2. 必要なら更新（年次でも可）
3. 2FA バックアップコードの再発行（Heroku ダッシュボード → Account Settings → 2FA）

## ローテーション後のチェックリスト

- [ ] 新トークン発行済み
- [ ] GitHub Secrets / Config Vars 更新済み
- [ ] 動作確認（CI 実行 / Basic 認証）成功
- [ ] 旧トークンを revoke
- [ ] パスワードマネージャに保管
- [ ] 次回ローテーション日をカレンダーに登録

## 漏洩疑い時の緊急対応

### gitleaks で漏洩検出された場合

```bash
# 1. 即座にトークンを revoke
heroku authorizations:revoke <leaked_id>

# 2. git history からも削除（必要なら）
# git filter-repo や BFG Repo-Cleaner を検討
# 公開済みリポジトリでは「漏洩したと見なす」が正解

# 3. 新トークン発行 + 上記の通常ローテーション手順
```

### Heroku アカウント乗っ取りの兆候

1. パスワード即時変更
2. 2FA を有効化（未有効なら）
3. すべての authorizations を revoke
4. Heroku Audit Log でアクセス履歴確認
5. アプリの Config Vars に不審な変更がないか確認

## 関連

- [運用要件 - シークレット管理](../../docs/design/non_functional.md#シークレット管理)
- [Heroku staging 環境セットアップ手順書](../../docs/operation/heroku_staging_setup.md)
- [運用要件 - 四半期運用](../../docs/design/operation.md#四半期運用)
