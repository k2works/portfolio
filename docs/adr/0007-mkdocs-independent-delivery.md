# ADR-0007: MkDocs（Tech Notes）を CI 統合ビルドから外し、GitHub Pages へ独立配信する

ポートフォリオ（Astro）の CI ビルドジョブから MkDocs ビルドを除外し、専用ワークフロー（`.github/workflows/mkdocs.yml`）が `main` push 時に GitHub Pages へ MkDocs を独立してデプロイする構成に分離する。Astro の Slug には MkDocs 出力を含めない。

日付: 2026-04-30

## ステータス

2026-04-30 承認

> 本 ADR は [ADR-0005](./0005-build-pipeline-unification.md) の「Astro + MkDocs を GitHub Actions で統合ビルド」のうち **MkDocs ビルド統合の部分のみ** を部分置換する。Astro 単体の「CI 一本化 / Heroku は Slug 受領のみ」の方針は ADR-0005 のまま維持される。

## コンテキスト

[ADR-0005](./0005-build-pipeline-unification.md) で「Astro + MkDocs を GitHub Actions で統合ビルド → 統合した `apps/web/dist/` を Heroku に Slug 受領」と決定した。しかし IT-1〜IT-3 を経た 2026-04-30 時点で、以下の事実が明らかになった：

1. **CI 上の MkDocs ビルドが PlantUML サーバーへの外部依存になっている**:

    - `plantuml-markdown` 拡張は `mkdocs build` 中に `plantuml.com` へ HTTP リクエストを多発させる（ドキュメント数 × 図数）。
    - CI ジョブで `plantuml.com` のレスポンスが遅延すると `Build MkDocs into apps/web/dist/docs` ステップが数分単位で待たされる。実測でステップ単独が 3〜5 分。
    - CI のフィードバック速度（PR トリガーから結果まで）を悪化させ、開発者のフロー状態を阻害。

2. **`actions/setup-python@v5` の `cache: pip` が `requirements.txt` を要求する**:

    - `pip install mkdocs ...` を直接書く構成だと依存固定ファイルが存在せず、`No file matched to **/requirements.txt or **/pyproject.toml` で失敗する。
    - `requirements.txt` を作成して固定する手間と、本番ランタイム（Heroku の Slug）には不要な Python 依存をリポジトリに置く違和感。

3. **MkDocs 出力は Astro の Slug 経路に必須ではない**:

    - 当初構想では `apps/web/dist/docs/` に MkDocs 成果物を集約し、Astro と同一ドメインで配信する想定だった。
    - 実装を進めた結果、Tech Notes 同居は v1.0（US-11）まで実施しないと決定。v0.1 の Heroku Slug に MkDocs を含めても閲覧導線がない。

4. **既に独立した MkDocs デプロイワークフローが存在する**:

    - `.github/workflows/mkdocs.yml` が `main` push で MkDocs を GitHub Pages に独立デプロイする構成で実装済み（`peaceiris/actions-gh-pages@v4`）。
    - CI の Build ジョブで MkDocs を再ビルドするのは二重実行となり、CI 時間と外部リクエスト数の無駄。

検討した選択肢：

| 選択肢 | 配信方式 | リスク |
|---|---|---|
| A. CI で MkDocs ビルドを継続（ADR-0005 原案通り） | Heroku Slug に同梱 | **却下**。PlantUML 遅延、Slug サイズ増、二重実行 |
| B. **CI から MkDocs を外し、GitHub Pages 専用ワークフローで独立配信** | GitHub Pages（`k2works.github.io/portfolio/` 等） | **採用**。CI 高速化、外部依存を main push 時のみに局所化 |
| C. PlantUML を事前生成して画像コミット | リポジトリに SVG/PNG を固定 | リポジトリ肥大化、ソース図と乖離するリスク |
| D. MkDocs を Astro Content Collection に取り込む | Astro が Markdown を直接処理 | v1.0 の US-11 で実施予定。v0.1 では時期尚早 |

## 決定

**選択肢 B を採用する。**

具体的な構成：

1. **`.github/workflows/ci.yml` から MkDocs ビルド関連ステップを完全削除**:

    ```yaml
    # 削除対象:
    # - Setup Python (for MkDocs)
    # - Install MkDocs
    # - Build MkDocs into apps/web/dist/docs
    ```

    ジョブ名を `Build (Astro + MkDocs)` から `Build (Astro)` に変更し、Astro の `npm run build` のみを CI で検証する。

2. **`.github/workflows/mkdocs.yml` を MkDocs 配信の単一ソースとする**:

    - `main` push をトリガーに `npm run docs:build` で MkDocs をビルドし、`peaceiris/actions-gh-pages@v4` で `gh-pages` ブランチへ公開する。
    - `develop` ブランチへの push では発火させない（Tech Notes は本番反映のみ）。
    - PlantUML サーバーへの外部依存はこのワークフロー内に閉じ込める。

3. **Heroku の Slug には MkDocs 出力を同梱しない**:

    - `apps/web/dist/docs/` ディレクトリを Slug に含めない。
    - Heroku 上で `mkdocs build` も実行しない（ADR-0005 の `heroku/nodejs` 単一 Buildpack 方針はそのまま）。

4. **ADR-0005 のコンプライアンスを部分修正**:

    - 「CI で `apps/web/dist/docs/index.html` の存在をデプロイ前に検証」を取り消し（取消線で残す）。
    - その他の項目（`heroku/nodejs` 単一 Buildpack、`mkdocs build` を Heroku で実行しない、`git push heroku main` 禁止）はそのまま維持。

5. **将来の方向性（v1.0 で再評価）**:

    - US-11「Tech Notes から技術的詳細に到達できる」の実装時に、Astro の同一ドメイン配信へ統合するか、GitHub Pages 独立配信を継続するか再評価する。
    - 本 ADR は v1.0 で **置換または廃止** の対象になり得る。

## 影響

### 良い影響

- **CI 速度の劇的改善**: Build ジョブが PlantUML 遅延の影響を受けなくなり、CI 全体のフィードバックが約 5 分以上短縮（実測で `Build MkDocs into apps/web/dist/docs` が永続的に応答待ちになるケースを排除）。
- **外部依存の局所化**: `plantuml.com` への HTTP リクエストは `main` push 時の MkDocs ワークフローに閉じ込められ、PR の CI には影響しない。
- **Slug サイズの最小化維持**: ADR-0005 の「Slug < 50 MB」目標を MkDocs を含めずに維持できる。
- **ワークフローの責務分離**: CI（コード品質保証）と MkDocs 配信（ドキュメント公開）が独立し、片方の障害がもう片方をブロックしない。
- **`requirements.txt` を作成しなくて済む**: Python 依存ファイルをリポジトリに増やさない。

### 悪い影響・リスク

- **MkDocs と Astro が別ドメインで配信される**: v0.1 時点では `<staging-domain>` と `k2works.github.io/portfolio/` が分離。ユーザー導線として Tech Notes へのリンクは Astro 側から外部リンクとして張る。
- **MkDocs ビルドが CI でカバーされない**: develop 上での MkDocs ビルド失敗は `main` マージまで検出されない。これは US-11 までの暫定状態として許容する（ドキュメント変更の頻度が低く、検出遅延のコストが小さい）。
- **GitHub Pages の制約に依存**: 1 GB / リポジトリ、月 100 GB トラフィック、ビルド 10 分の制限がある。当面は問題ないが将来監視。

### 取り消し可能性

`ci.yml` に MkDocs ステップを再追加し、`requirements.txt` を作成すれば ADR-0005 の原案構成に戻すことは可能。乗り換えコストは低（ステップ追加 5 分）。ただし PlantUML 遅延問題の根本解決にはならないため非推奨。

US-11 実装時には Astro Content Collection への取り込みで解決される見込み。

## コンプライアンス

- `.github/workflows/ci.yml` の Build ジョブが **Astro のみ** をビルドし、`Setup Python` / `Install MkDocs` / `Build MkDocs into apps/web/dist/docs` ステップを含まないことをレビュー時に確認する。
- `.github/workflows/mkdocs.yml` が `main` push でのみ発火することを `on.push.branches: [main]` で担保する。
- Heroku Slug に `apps/web/dist/docs/` が含まれないことを、`heroku run ls dist/` 等で定期確認する（任意）。
- 本 ADR の有効期限を v1.0 リリース時とし、その時点で「ADR-0007 を維持 / 廃止 / 置換」の判断を行う。

## 備考

- 著者: ポートフォリオプロジェクト（k2works/portfolio）
- 関連コミット:

    - `fix(ci): gitleaks v8 と setup-python のキャッシュ設定エラーを修正`
    - `fix(ci): Build ジョブから MkDocs ビルドを外す`

- 関連ドキュメント:

    - [ADR-0005 ビルド境界を GitHub Actions に一本化](./0005-build-pipeline-unification.md)（部分置換元）
    - [ADR-0003 MkDocs を「Tech Notes」として共存させる](./0003-mkdocs-coexistence-strategy.md)（noindex の方針）
    - [フロントエンドアーキテクチャ](../design/architecture_frontend.md)
    - [リリース計画](../development/release_plan.md)（US-11 = v1.0 で再評価）
    - `.github/workflows/ci.yml`
    - `.github/workflows/mkdocs.yml`

- 再評価のトリガー:

    - v1.0 の US-11「Tech Notes から技術的詳細に到達できる」実装時
    - GitHub Pages の制約緩和または逆に厳格化
    - PlantUML サーバーの停止 / 障害頻発（事前生成方針への切り替え検討）
    - Astro Content Collection の機能拡張（MkDocs 機能の代替が容易に）
