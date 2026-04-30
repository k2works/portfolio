# ADR-0005: ビルド境界を GitHub Actions に一本化し、Heroku は Slug 受領のみとする

ポートフォリオ（Astro）と MkDocs を **GitHub Actions で統合ビルド**し、Heroku には**事前ビルド済み成果物だけを配置**する。Heroku 側の `heroku-community/python` Buildpack を廃止し、`heroku/nodejs` Buildpack のみとする。

日付: 2026-04-30

## ステータス

2026-04-30 承認

## コンテキスト

設計レビュー（[2026-04-30](../review/design_review_20260430.md)）で **Architect** から指摘：

- インフラ設計は「Heroku 上で 2 段 Buildpack（`heroku/nodejs` + `heroku-community/python`）で同時ビルド」と書く。
- 一方フロントエンド設計は「CI 内で MkDocs ビルド → `apps/web/dist/docs/` に出力 → Astro ビルド成果物と統合」と書く。
- **Heroku 上のビルド** と **GitHub Actions 上のビルド** の二系統が並存し、CI で通ったものと Heroku で組み上がるものが乖離する事故が起きやすい。
- `heroku-community/python` で MkDocs（pymdown-extensions + plantuml-markdown + mkdocs-material）をインストールするビルドは初回 3〜5 分以上、`web boot timeout = 60s` の議論が必要。
- 2 段 Buildpack の運用実績は薄く、`heroku-postbuild` で `mkdocs build` を呼ぶ際の Python 環境構築の重さも問題。

検討した選択肢：

| 選択肢 | ビルド場所 | Buildpack | リスク |
|---|---|---|---|
| A. 現状維持（Heroku で 2 段ビルド） | Heroku | `nodejs` + `python` | ビルド時間長、二系統の真実、運用実績薄 |
| B. **GitHub Actions 統合ビルド + Heroku は受領のみ** | CI | `nodejs` のみ | **採用**。CI が真実の正本、Heroku ビルドは静的配信のみ |
| C. Container Registry 経由（Docker イメージ） | CI | （Container Stack） | Slug より厳格だが、静的サイトには過剰 |

## 決定

**選択肢 B を採用する。**

具体的な構成：

1. **GitHub Actions のビルドジョブ**:
   - `actions/setup-node@v4` で Node.js 22 をセットアップ
   - `actions/setup-python@v5` で Python 3.12 をセットアップ
   - `npm ci` → `npm run build`（Astro ビルド）→ `mkdocs build -d apps/web/dist/docs`（MkDocs ビルド）
   - 統合ビルド成果物を `apps/web/dist/` に集約
   - `apps/web/dist/`、`Procfile`、`apps/web/server.js`、`apps/web/package.json`（runtime のみ）を含む slug を作成

2. **Heroku 側の Buildpack**:
   - `heroku/nodejs` のみ（`heroku-community/python` は廃止）
   - `package.json` の `scripts.heroku-postbuild` は使用しない（CI で完結）
   - `engines.node = ">=22 <23"` を維持

3. **デプロイ方法**:
   - GitHub Actions から **Heroku Container Registry**（または Heroku Build API） に slug を push
   - 推奨: `heroku-deploy` GitHub Action でビルド済み slug を直接送り込む
   - フォールバック: `heroku-builds:create` CLI コマンド

4. **`apps/web/package.json` の最小化**:
   - `dependencies`: `express`、`helmet`、`morgan` のみ（runtime 必須）
   - `devDependencies` は CI のみで使い、Heroku に送らない
   - `npm prune --production` を CI で実行してから slug 化

## 影響

### 良い影響

- **CI が唯一の真実**: Heroku 上で組み上がるものと CI の成果物が完全一致、差分事故が起きない。
- **Slug サイズ削減**: Python ランタイム + MkDocs 依存（数百 MB）が消え、slug が < 50 MB に収まる。
- **デプロイ高速化**: Heroku 側のビルドが 30 秒以内（slug 展開のみ）になり、ロールバック・プロモートが速い。
- **Buildpack 運用リスク低減**: `heroku-community/python` の運用実績薄さ問題を回避。
- **`web boot timeout = 60s` を完全クリア**: ビルドは事前完了、起動は Express の `app.listen` のみ。
- **MkDocs の依存性管理**: `requirements.txt` が CI 専用となり、本番ランタイムから完全分離。

### 悪い影響・リスク

- GitHub Actions に Heroku デプロイの権限（`HEROKU_API_KEY`）を持たせる必要があり、シークレット管理が増える。
- Container Registry 経由は GitHub Actions 側で `heroku container:push` の手順を覚える必要がある。
- ローカルで `git push heroku main` する従来の運用が使えなくなる（CI 経由必須）。
- ビルド済み slug を CI から送るため、CI 障害時の緊急デプロイ手順が変わる（runbook 化必要）。

### 取り消し可能性

`heroku-community/python` を再追加して `heroku-postbuild` で `mkdocs build` を呼ぶ構成に戻すのは可能。ただし二系統並存の問題が再燃するため非推奨。乗り換えコストは中。

## コンプライアンス

- `app.json` または `Procfile` 周辺で `buildpacks` が `heroku/nodejs` のみを参照していることを CI でチェック。
- GitHub Actions のワークフローで `npm prune --production` の実行を必須化。
- `mkdocs build` が CI のみで実行され、Heroku 側で実行されないことを `app.json`/`scripts` セクションで担保。
- ローカル `git push heroku main` を禁止する旨を `ops/runbook/deploy.md` に明記。
- CI で `apps/web/dist/docs/index.html` の存在をデプロイ前に検証（MkDocs ビルド漏れ防止）。

## 備考

- 著者: ポートフォリオプロジェクト（k2works/portfolio）
- 関連ドキュメント:
  - [インフラストラクチャアーキテクチャ](../design/architecture_infrastructure.md)
  - [フロントエンドアーキテクチャ](../design/architecture_frontend.md)
  - [技術スタック](../design/tech_stack.md)
  - [分析成果物レビュー（2026-04-30）](../review/design_review_20260430.md)（H06 への対応）
- 再評価のトリガー:
  - GitHub Actions の利用枠（無料枠 2,000 分/月）超過時
  - Heroku Container Registry の仕様変更
  - 動的機能追加でランタイム依存が複雑化した場合（Container Stack への移行検討）
