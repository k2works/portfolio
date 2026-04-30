# ADR-0006: GitHub Actions から Heroku への自動デプロイは Heroku CLI + `~/.netrc` 経由で認証する

GitHub Actions Runner に Heroku CLI をインストールし、`HEROKU_API_KEY` から `~/.netrc` を heredoc で生成して `heroku git:remote -a $HEROKU_APP` + `git push heroku HEAD:main --force` で Slug を送り込む。URL 埋め込み Basic 認証（`https://x:KEY@git.heroku.com/...`）と `akhileshns/heroku-deploy` Action は採用しない。

日付: 2026-04-30

## ステータス

2026-04-30 承認

## コンテキスト

[ADR-0005](./0005-build-pipeline-unification.md) で「ビルド境界を GitHub Actions に一本化、Heroku は Slug 受領のみ」と決めた。これに伴い、CI ジョブから Heroku staging アプリへ自動デプロイする経路の **認証方式** を確定させる必要がある。

IT-3 完了直後（2026-04-30）の実装過程で、以下の問題が連続的に発生した：

1. **`akhileshns/heroku-deploy@v3.13.15` の不採用**:

   - Action 内部で `heroku` コマンドを呼ぶが、ubuntu-latest Runner にはデフォルトで Heroku CLI が入っていない。
   - 実行時に `heroku: not found` で即座に失敗。Action 側で CLI をインストールしないため自分でインストールするしかない。
   - 既製 Action を使う利点が消失する。

2. **URL 埋め込み Basic 認証の Heroku 側非推奨化**:

   - 当初 `git remote add heroku "https://x:${HEROKU_API_KEY}@git.heroku.com/${HEROKU_APP}.git"` 方式を試した。
   - Heroku が 2024 年に **HTTP Basic 認証（URL 埋め込み）を非推奨** と公式表明（`Do not authenticate with username and password using git`）。
   - 実行すると `Authentication failed` で失敗。公式ドキュメントは Heroku CLI 経由の `~/.netrc` 認証を推奨。

3. **`heroku git:remote -a` 単独では `~/.netrc` を書かない**:

   - `heroku git:remote` は `git remote add heroku` の糖衣構文に過ぎない（remote URL 追加のみ）。
   - `~/.netrc` は通常 `heroku login` が対話的に書く。CI では `heroku login` が使えない。
   - 結果として `git push heroku` で `fatal: could not read Username for 'https://git.heroku.com': No such device or address` が返る。

4. **Heroku API Token の取得経路**:

   - 公式は `heroku authorizations:create -d "..." --short` で長期 Token を生成（Token は `HRKU-` プレフィックス、長さ約 65 文字）。
   - Windows の bash 環境（Git Bash）から `heroku` を呼ぶと `'C:\Program' は内部コマンドまたは外部コマンド...` で文字化けエラー。PowerShell では正常動作。
   - `gh secret set` に空文字列が渡ると Secret が静かに上書き破壊される（jq でのパース失敗時に発生）。

検討した選択肢：

| 選択肢 | 認証方式 | リスク |
|---|---|---|
| A. URL 埋め込み Basic 認証 | `https://x:KEY@git.heroku.com/APP.git` | **却下**。Heroku 非推奨で動作しない（`Authentication failed`） |
| B. `akhileshns/heroku-deploy` Action | Action が抽象化 | **却下**。Action は CLI を内蔵しない（`heroku: not found`）。利点が消失 |
| C. **Heroku CLI + `~/.netrc` heredoc + `heroku git:remote` + `git push`** | netrc 経由 git credentials | **採用**。Heroku 公式推奨、Slug 経路は ADR-0005 と整合 |
| D. Container Registry（`heroku container:push`） | Docker Image 認証 | 静的サイトには過剰、Slug より構築複雑 |
| E. Heroku Build API（`heroku builds:create`） | API 直送 | tarball を CI で組み立てる必要、複雑 |

## 決定

**選択肢 C を採用する。**

具体的な構成（`.github/workflows/deploy.yml`）：

```yaml
- name: Install Heroku CLI
  run: curl https://cli-assets.heroku.com/install.sh | sh
- name: Deploy to Heroku staging via git push
  env:
    HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
    HEROKU_APP: ${{ secrets.HEROKU_APP_STAGING }}
    HEROKU_EMAIL: ${{ secrets.HEROKU_EMAIL }}
  run: |
    git config --global user.email "$HEROKU_EMAIL"
    git config --global user.name "GitHub Actions"
    cat > "$HOME/.netrc" <<EOF
    machine git.heroku.com
      login $HEROKU_EMAIL
      password $HEROKU_API_KEY
    machine api.heroku.com
      login $HEROKU_EMAIL
      password $HEROKU_API_KEY
    EOF
    chmod 600 "$HOME/.netrc"
    heroku git:remote -a "$HEROKU_APP"
    git push heroku HEAD:main --force
```

要点：

1. **Heroku CLI を毎ジョブインストール**: `curl https://cli-assets.heroku.com/install.sh | sh`。ubuntu-latest にプリインストールされていないため必須。インストール時間は約 5 秒で許容範囲。
2. **`~/.netrc` を heredoc で明示生成**: `git.heroku.com` と `api.heroku.com` の両方に同じ Email + API Key ペアを書く。Heroku Git push と CLI コマンドの両方が認証できる。
3. **`chmod 600 ~/.netrc` を必ず実行**: パーミッション緩いと git が無視する。
4. **`heroku git:remote -a $HEROKU_APP` で remote URL を設定**: Heroku アプリ名を URL に展開する糖衣構文。
5. **`git push heroku HEAD:main --force`**: develop ブランチからのデプロイを Heroku の `main` ブランチに強制反映する。

API Token 管理：

- `heroku authorizations:create -d "GitHub Actions for portfolio - YYYY-MM" --short` で長期 Token を生成。
- **PowerShell から実行する**（Windows の bash では `'C:\Program'` 文字化けエラー）。
- Token は `HRKU-` プレフィックス + 60 文字以上であることを **`gh secret set` 前に検証** する。空文字列が登録されると Secret が破壊される。
- 検証コード例（PowerShell）:

  ```powershell
  $token = heroku authorizations:create -d "..." --short
  if ($token.Length -gt 30 -and $token.StartsWith("HRKU-")) {
    $token | Out-File -NoNewline -Encoding ascii "$env:TEMP\t.txt"
    Get-Content "$env:TEMP\t.txt" -Raw | gh secret set HEROKU_API_KEY
  }
  ```

GitHub Secrets：

| Secret 名 | 値 | 用途 |
|---|---|---|
| `HEROKU_API_KEY` | `HRKU-...`（長期 Token） | Heroku CLI / git push 認証 |
| `HEROKU_APP_STAGING` | `k2works-portfolio-stg` | デプロイ先アプリ名 |
| `HEROKU_EMAIL` | `kakimomokuri@gmail.com` | netrc の login フィールド |

## 影響

### 良い影響

- **Heroku 公式推奨経路に準拠**: 非推奨 API（URL 埋め込み Basic 認証）への依存がない。
- **シンプルで透明**: `~/.netrc` の中身を読めば認証メカニズムが理解できる。隠蔽された Action のブラックボックスがない。
- **既存の Slug 経路（ADR-0005）と整合**: `git push heroku` で `heroku/nodejs` Buildpack が走る経路をそのまま使える。
- **Heroku CLI 由来の追加機能**: `heroku releases`、`heroku ps`、`heroku logs` が同じジョブから呼べるため、後続のヘルスチェックやログ確認の追加が容易。
- **Token ローテーションが容易**: `heroku authorizations:revoke` + 新規 `create` + `gh secret set` の 3 ステップで完了。

### 悪い影響・リスク

- **API Token がジョブログに露出するリスク**: `~/.netrc` の中身を `cat` 等で出力すると Token が漏れる。GitHub Actions の自動マスクは `${{ secrets.HEROKU_API_KEY }}` 由来の値だけが対象。**heredoc 内の `$HEROKU_API_KEY` 展開後は手動で `set +x` するか、絶対に `cat ~/.netrc` をしないこと**。
- **Heroku CLI のインストール時間**: 毎ジョブ約 5 秒。`actions/cache` で `~/.heroku-cli` をキャッシュする最適化は将来検討。
- **Windows ローカル環境の制約**: Token 生成は PowerShell 経由が必要。bash 系（Git Bash / WSL）は文字化けで使えない。
- **API Token の長期有効性**: `--short` フラグで生成した Token は明示的失効まで有効。退職・引き継ぎ時に必ず失効すること。

### 取り消し可能性

選択肢 D（Container Registry）への移行は可能。Docker イメージビルドの追加と `heroku.yml` の作成が必要。乗り換えコストは中。動的機能追加でランタイム依存が複雑化した場合に再検討する。

## コンプライアンス

- `.github/workflows/deploy.yml` の `Deploy to Heroku staging via git push` ステップで以下を必ず満たす:

    - `~/.netrc` を heredoc で生成し、`chmod 600` を呼ぶ
    - `heroku git:remote -a` で remote を設定する
    - `git push heroku HEAD:main --force` で送る
    - `cat ~/.netrc` 等の中身を出力するコマンドを書かない

- GitHub Secrets の `HEROKU_API_KEY` 登録時に **`HRKU-` プレフィックスと長さ 30 以上の検証** を必ず行う（PowerShell の検証コード参照）。
- Heroku Token の生成・登録手順を `docs/operation/heroku_staging_setup.md` の Token ローテーション節に明記する。
- `akhileshns/heroku-deploy` Action と URL 埋め込み Basic 認証は **`deploy.yml` で使用禁止**。発見次第 PR で差し戻す。
- ジョブ完了後に `heroku logs --num 50` でデプロイ後のアプリ状態を確認できるよう、Heroku CLI の利用を許容する。

## 備考

- 著者: ポートフォリオプロジェクト（k2works/portfolio）
- 関連コミット:

    - `fix(ci): Heroku CLI 経由で認証してデプロイする`
    - `fix(ci): ~/.netrc を明示的に書いて git push の認証を通す`

- 関連ドキュメント:

    - [ADR-0005 ビルド境界を GitHub Actions に一本化](./0005-build-pipeline-unification.md)（前提）
    - [ADR-0002 ホスティングプラットフォームに Heroku を採用](./0002-hosting-heroku.md)（背景）
    - [Heroku staging 環境セットアップ手順書](../operation/heroku_staging_setup.md)（運用手順）
    - Heroku 公式: <https://devcenter.heroku.com/articles/git#http-git-authentication>

- 再評価のトリガー:

    - Heroku が API Token 形式や認証フローを再変更した場合
    - GitHub Actions Runner の Heroku CLI プリインストール開始時（不要なインストールステップを削除）
    - Container Stack 移行（動的機能追加）時
    - Token ローテーション運用が苦痛になった場合（OIDC 連携等の検討）
