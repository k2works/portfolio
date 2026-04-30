# 分析成果物レビュー結果（2026-04-30）

## レビュー対象

`docs/design/` 配下の設計ドキュメント 8 本 + `docs/adr/` 配下の ADR 2 本：

- [architecture_backend.md](../design/architecture_backend.md)
- [architecture_frontend.md](../design/architecture_frontend.md)
- [architecture_infrastructure.md](../design/architecture_infrastructure.md)
- [ui_design.md](../design/ui_design.md)
- [tech_stack.md](../design/tech_stack.md)
- [test_strategy.md](../design/test_strategy.md)
- [non_functional.md](../design/non_functional.md)
- [operation.md](../design/operation.md)
- [adr/0001-frontend-framework-astro.md](../adr/0001-frontend-framework-astro.md)
- [adr/0002-hosting-heroku.md](../adr/0002-hosting-heroku.md)

要件定義・ユースケース・ユーザーストーリー・ドメインモデル・データモデルは未作成。

## レビュー方式

5 つの XP エージェントを並列起動した：

- xp-product-manager（ビジネス価値）
- xp-architect（技術的実現性）
- xp-interaction-designer（ユーザー体験）
- xp-tester（テスト可能性）
- xp-user-representative（利用者視点）

## 総合評価

設計ドキュメント単体の品質は概ね高水準で、特にトレーサビリティ（UI シナリオ ↔ E2E ID）、トレードオフの明文化、将来拡張シナリオの分離は優秀。一方で **3 つの構造的問題**が共通指摘された：

1. **要件定義・ユーザーストーリーが未作成のまま設計が先行**しており、XP の規律から逸脱している（PM, Tester, Architect）
2. **採用・営業向け個人サイトという極小スコープに対して設計が過剰投資**気味（PM, Architect, User Representative）
3. **「Heroku 単一 Dyno + CDN なし」で SLO 99.5% / LCP p95 < 2.5s が実現可能か未検証**で、Cloudflare 前段配置の初期採用を推奨（Architect, User Representative）

## 改善提案（重要度順）

### 高（10 件）

| # | 提案 | 指摘元 | 理由 |
|---|------|--------|------|
| H01 | ユーザーストーリーを最優先で起票し、E01〜E12 を受入条件として紐付ける | PM, Tester | INVEST の Valuable / Estimable / Testable が未充足。設計から逆引きで `docs/requirements/user_story.md` を作成 |
| H02 | v1 のスコープを Walking Skeleton（S01 ホームのみ）に切り詰める | PM | 5 画面 + 補助 2 画面は採用判断に過剰。v0.1 → v0.3 の段階リリースでベロシティ計測の母数を獲得 |
| H03 | MkDocs `/docs/` 同居の戦略判断を明文化（学習継続アピール / `noindex` 隠蔽 / ナビ名変更） | PM, User Rep, Interaction Designer, Architect | 採用ノイズになるか強みになるかの戦略未決のまま技術判断が先行。「Tech Notes」等の名称変更を含め再考 |
| H04 | SLO 99.5% / LCP p95 < 2.5s の実現可能性を再検証、Cloudflare 無料プラン前段配置を初期構成に格上げ | Architect | Heroku Common Runtime 単一リージョン + CDN なしでは日本からの LCP p95 < 2.5s 達成が困難。月額 $0 で得られる効果が大きい |
| H05 | Express + helmet + supertest + Zod 等の構成が過剰設計でないか再検証 | Architect | `compression` の二重圧縮、`express-sslify` の無限リダイレクト罠、CSP `script-src 'self'` で Astro hydration が落ちる懸念 |
| H06 | MkDocs と Astro のビルド境界を一本化（GitHub Actions 統合ビルド推奨）、ADR 化 | Architect | 「Heroku 上ビルド」と「CI 上ビルド」の二系統が並存し変更安全性を損なう |
| H07 | ホーム（S01）ファーストビューに「採用判断の核」を追加（得意領域タグ / キャッチコピー / 実績ハイライト） | Interaction Designer | 自己紹介 2〜3 行では専門領域の解像度が低く、5〜10 秒で離脱されるリスク |
| H08 | Works 一覧（S02）の絞り込み UI 挙動を明文化（単一/複数選択、URL 共有、0 件時、キーボード） | Interaction Designer | salt 図だけでは挙動が曖昧で E03 の E2E が具体化できない |
| H09 | Works 詳細（S03）の成果記述を「課題 → 挑戦 → 解決 → 成果」のストーリー構造に変更 | Interaction Designer, User Rep | 「KPI 改善: xx %」だけでは関与の深さ・再現性が伝わらず、業務委託判断に耐えない |
| H10 | Skills のレベル表現を再考（★ の凡例 or 「現役 / 過去」+ Work への逆参照） | User Rep, Interaction Designer | ★ 自己評価は採用担当者から最も信用されにくい情報。「Java は Work A, C で使用」の逆参照が必要 |

### 中（13 件）

| # | 提案 | 指摘元 | 理由 |
|---|------|--------|------|
| M01 | 「採用面接前後の停止回避」の運用仕組みを追加（GitHub Pages 常時ミラー、面接 2 営業日前の merge freeze） | User Rep | SLO の動機を実装手段で裏打ちする必要。コスト 0 の対策がある |
| M02 | Works 詳細に `team_size` / `position` / `involvement` を追加 | User Rep | 業務委託発注検討者は「同じ仕事を任せられるか」を判断したい |
| M03 | Contact 画面に `availability`（稼働可否）を追加 | User Rep | 「今、新規案件を受ける状態か」が最も知りたい情報 |
| M04 | テスト戦略に技法（境界値・同値分割・状態遷移・デシジョンテーブル）の適用例を明示 | Tester | 属人性排除と抜け漏れ防止 |
| M05 | Heroku Eco Dyno コールドスタート対策の具体化（globalSetup での `/healthz` リトライ、Playwright `retries: 2`） | Tester, Architect | E2E Flaky リスクの常態化を防ぐ |
| M06 | 統合テストに `Cache-Control` / セキュリティヘッダ値 / `Range` / gzip 等の検証を追加 | Tester | 「主要ヘッダが付与される」だけでは CSP 違反を検出できない |
| M07 | XSS / Markdown サニタイズの自動検証を追加（`set:html` の lint 検出 + フィクスチャ E2E） | Tester | 「方針はある、ガードはない」状態の解消 |
| M08 | JavaScript 無効環境の E2E プロファイル（`javaScriptEnabled: false`）を 1 シナリオ追加 | Tester | Astro Zero JS 採用利点を契約として担保 |
| M09 | Lighthouse 予算 90/95/95 の段階導入（v0.1 は 80/90/90、v1.0 で 90/95/95） | PM | Walking Skeleton で達人基準は厳しすぎ、リリースが詰まる |
| M10 | Lighthouse CI を Heroku staging ではなく CI ローカルの `astro preview` で実行 | Tester, Architect | Eco Dyno のスコアぶれを排除し、退化検出のみを production 計測で行う |
| M11 | アーキテクチャ判断フローのアサンプション明示（「永続化なし」が結論を上書きする論理ギャップを補強） | Architect | ロジカルシンキング.md の原則に従う |
| M12 | テスト戦略の配分表（10/20/15/55%）を「テスト本数」と「カバレッジ%」で混同しないよう明記 | Tester | 「ユニット 10%」と「Express カバレッジ 90%」が独立した指標であることを明示 |
| M13 | OGP 画像のページ別レイアウト指針を UI 設計に追加 | Interaction Designer | SNS シェア時の第一印象を制御 |

### 低（10 件）

| # | 提案 | 指摘元 | 理由 |
|---|------|--------|------|
| L01 | ADR-0001 の再評価トリガー「動的機能比率 30%」を観測可能な指標に再定義 | Architect | 「ハイドレーション島の数」「クライアント状態管理 3 ヶ所」など計測可能に |
| L02 | Buildpack 順序を `heroku-community/python` → `heroku/nodejs` と明記、ビルド時間上限を operation.md に追加 | Architect | Heroku では最後の Buildpack のプロセスタイプを採用 |
| L03 | SEV-2 / SEV-3 の境界値をユーザー影響度で再定義 | Architect | Lighthouse 70 が SEV-2 は重すぎ、500 ページ存在は SEV-1 寄り |
| L04 | S91（`/docs/`）が「同一タブ遷移」であることを明示、ナビにアイコンで区別 | Architect, Interaction Designer | 「外部相当」と書きつつ実装が同一ホスト同一タブで紛れる |
| L05 | OGP 画像の実体ダウンロード可否（200 + 寸法）まで E2E で検証 | Tester, Interaction Designer | SNS シェア事故を防ぐ |
| L06 | `featured` フィールドを Work スキーマに追加（手動 pin 方式） | Interaction Designer, User Rep | 「Featured 3 件」の選定基準が暗黙 |
| L07 | Skills の経験年数を `since: 2018` 形式にしてビルド時に計算 | User Rep | 毎年更新を自動化、メンテ忘れ防止 |
| L08 | タッチターゲットサイズを 44×44 px 以上、間隔 8px 以上で明記 | Interaction Designer | WCAG 2.5.5 / Apple HIG 準拠 |
| L09 | View Transitions API の退化的挙動を明記（未対応ブラウザは即時遷移） | Interaction Designer | 「対応ブラウザのみ」の意図を読み手に伝える |
| L10 | linkinator の外部リンク検査を週次 cron に分離、`429`/`503` を許容 | Tester | 一時的な外部失敗での誤検出を抑制 |

## 矛盾事項

エージェント間の指摘で本質的に対立するものは少なく、多くは補完的でした。次の 2 件のみが論点として残ります。

| # | 視点 A | 視点 B | 論点 | 推奨判断 |
|---|--------|--------|------|----------|
| C01 | PM: v1 を Walking Skeleton（S01 のみ）まで切り詰める | Interaction Designer: S01 を強化 + Profile 専用画面 (`/about/`) を追加 | スコープを絞るか、ホームを充実させるか | **両立可能**。v0.1 では S01 のみとし、その S01 にファーストビュー強化（H07）を最初から実装する。`/about/` は v0.2 以降。 |
| C02 | Architect: 統合ビルドを GitHub Actions に一本化（Heroku は Slug 受領のみ） | Infrastructure 設計: Heroku 2 段 Buildpack で Astro + MkDocs を Heroku 上ビルド | ビルドの正本をどこに置くか | **GitHub Actions 統合ビルド推奨**。Slug サイズ削減と Buildpack 重複排除のメリットが大きい。ADR-0003 として記録すべき論点 |

## エージェント別フィードバック詳細

<details>
<summary>xp-product-manager（高: 3 / 中: 4 / 低: 1）</summary>

### 評価サマリー

設計品質は単体で見れば高水準（特にテスト戦略・非機能要件は優秀）ですが、「採用・営業向け個人プロフィール」という極小スコープに対して設計が過剰投資の傾向にあり、何より要件定義・ユーザーストーリーが未作成のまま設計が先行している点でビジネス価値の検証手段を欠いています。XP の規律（計画ゲーム・小さなリリース）から大きく逸脱しており、「動作するきれいなゴミ」を生むリスクを抱えた状態です。

### 良い点

- 全ドキュメントで「採用・営業向け個人プロフィール」という North Star がブレずに記述されている
- `non_functional.md` の「99.9% を目指さない理由」など**やらないこと**が明文化、YAGNI 違反の抑止に効いている
- 各ドキュメントに「将来拡張」セクションがあり、v1 と v2+ が分離されている
- OOUX で画面 5 枚が一意に導かれており、ストーリーを書く際の粒度の手がかりになる
- 逆ピラミッド + Lighthouse CI の選択は静的サイトの価値構造に整合
- ADR が取り消し可能性・再評価トリガーまで記述
- `test_strategy.md` にストーリー紐付けの素地

### 主要な懸念

- 計画ゲームの不在（リリース計画・イテレーション計画なし）
- 「動作するきれいなゴミ」リスク（未公開個人サイトに対する設計の精緻さが過剰）
- ベロシティ未計測
- 採用担当者ペルソナの解像度不足（技術スカウト / 人材エージェント / 直接応募人事で必要情報が異なる）
- 「営業向け」の考慮（料金感・受託可否・対応領域）が薄い
- MkDocs 同居の戦略未決

### スコープ外の発見

- CLAUDE.md の規律（戦略 → 要件 → ユースケース → 設計）と逆行
- インセプションデッキ未作成（`analyzing-inception-deck` スキル未使用）
- ビジネスアーキテクチャ分析の欠落（BMC で 1 枚絵）
- GitHub Project / Issue 同期未着手
- `ops/runbook/` の参照先がまだ存在しない（リリース前にスケルトン作成が必要）

</details>

<details>
<summary>xp-architect（高: 3 / 中: 4 / 低: 2）</summary>

### 評価サマリー

8 ドキュメント間の意図と数値が高い水準で整合しており、規模に対する設計品質は良好。ただし「Heroku 単一 Dyno + CDN なし」での SLO 到達可能性、純静的サイトに対する Express 構成の過剰設計、MkDocs と Astro の同居運用に潜むビルド整合性のリスクの 3 点に変更容易性の観点から見直しの余地。

### 良い点

- 判断軸の表が ADR 的に意思決定記録として機能
- ドキュメント横断のトレーサビリティ（UI シナリオ → E01〜E12、Lighthouse 予算の整合）
- 将来拡張シナリオの出口設計（レイヤード昇格条件等）
- 段階的 IaC（XP の「動かしてから良くする」と整合）
- エラーバジェット運用の SRE 文化を個人スケールに翻訳
- 逆ピラミッド形の選択根拠が明快

### 主要な懸念

- CDN 前段なしの Heroku 単一 Dyno でのコールドキャッシュ問題（巡回 bot で Eco Dyno が休まらない、Lighthouse 計測のキャッシュ未温問題）
- Astro v5 + Tailwind v4 の最新メジャー同士の組み合わせの安定性（v3 + 公式 integration の方が安定）
- dotenv-vault / Heroku Config Vars / GitHub Secrets の三系統並走による真実の所在不明
- 「個人サイト × SLO 99.5%」のバジェット運用の現実性（SEV-1 一発で消化）
- MkDocs と Astro のリンクの相互整合性検証が CI に未組込
- AWS 移行コスト評価の楽観性

### スコープ外の発見

- 要件定義・ユースケース・ストーリーの未整備（CLAUDE.md ライフサイクルからの逸脱）
- Heroku の地理的制約（US/EU のみ）と日本ユーザー向け SEO 影響
- `apps/web/` のディレクトリ構造とモノレポ意図の整合性（`apps/portfolio/` `apps/docs/` 構成の検討）
- README.md / AGENTS.md / CLAUDE.md から設計ドキュメントへの導線整備

</details>

<details>
<summary>xp-interaction-designer（高: 4 / 中: 4 / 低: 2）</summary>

### 評価サマリー

OOUX に基づく明確なオブジェクトモデル、画面遷移図と salt 図の網羅、A11y・レスポンシブ要件の数値化において堅実。一方で「採用担当者が短時間で判断する」主要ペルソナの行動モデルへの最適化、特にファーストビューの説得力構築と Works のスキャン性・成果記述構造に改善余地。

### 良い点

- OOUX の 4 オブジェクトモデルが画面パターンに整理されている
- 訪問者アクションを「閲覧と外部遷移のみ」に明示的にスコープ
- 画面遷移にシナリオ A/B のシーケンス図を併記
- `aria-current="page"` で現在地を可視化
- ダークモードの退化的削除
- 404 のリカバリ動線が 2 経路
- 連絡先で返信時間を明示
- 計測指標の定義

### 主要な懸念

- Featured Works 3 件の選定基準が Content Collections スキーマに不在
- 同業エンジニア層への ADR / 技術ブログ動線が弱い
- モバイルでのページ高さが過大（6〜8 スクロール分の縦長）
- Heroku Eco Dyno コールドスタート時のローディング戦略が UI に欠落
- Skills / Contact に検索性向上の手段がない（Works 詳細から逆引きできる動線）

### スコープ外の発見

- `pages/skills.astro` 単一ファイル（拡張時のディレクトリ統一性）
- `<html lang="ja">` の明示と i18n 集約方針
- E12 の `noreferrer` 設計意図の明文化
- 画面遷移図に HTTPS リダイレクトのノート追加

</details>

<details>
<summary>xp-tester（高: 4 / 中: 5 / 低: 3）</summary>

### 評価サマリー

逆ピラミッド形 + 静的解析ゲート + Lighthouse CI の形状選択は静的サイトの価値構造に対し戦略的に妥当で、E2E ID〜UI シナリオのトレーサビリティも明示されており土台は堅い。一方でテスト技法の明示的適用が弱く、エッジケース網羅・Flaky 対策・受入基準への落とし込みに改善余地。

### 良い点

- 形状選択の根拠が明示
- 静的解析をテストレベル 0 として位置付け
- Content Collections + Zod をビルド時バリデーションに昇華
- UI シナリオ ⇄ E2E ID のトレーサビリティ
- PR フィードバック 10 分以内の明示的目標
- Lighthouse CI 予算の定量化と失敗時挙動の明示
- モック戦略を最小限に保つ判断
- TDD/BDD の適用局面が具体化

### 主要な懸念

- ストーリー未作成のまま E2E ID を確定（後の ID リナンバリングリスク）
- Lighthouse 予算（90/95/95）vs Heroku Eco Dyno コールドスタートの矛盾
- ユニット 10% でカバー不足を静的解析で本当に埋められるか
- PR フィードバック 10 分の達成可能性（Astro+MkDocs ビルド 3 分 + E2E 5 分 + Lighthouse 3 分 = 11 分）
- CSP 値の自動検証なし
- ビジュアルスナップショットのフォントレンダリング差

### スコープ外の発見

- architecture_backend.md / architecture_frontend.md にあるテスト戦略表との二重管理
- INP 目標が Lighthouse 予算に未組込
- `set:html` 禁止の ESLint ルール未具体化
- 月次ロールバック実演が staging 限定（本番リハーサルは規模次第）
- `Procfile` 未存在（要確認）

</details>

<details>
<summary>xp-user-representative（高: 3 / 中: 4 / 低: 0）</summary>

### 評価サマリー

3 つのペルソナ（採用担当者・発注検討者・同業エンジニア）に対する基本動線は妥当で運用負荷も現実的。ただし採用判断という実務シナリオで決定打となる情報（役割の粒度・成果の定量化・稼働可否）の欠落と、「面接前後の停止は避ける」SLO に対する具体的な仕組みの不在が最大の弱点。

### 良い点

- OOUX が訪問者の問いの順序と一致
- シナリオ A が業務の実態に即している
- コンタクトフォームを持たず外部リンクに頼った判断は正しい（履歴が手元に残る）
- ダークモード対応が `prefers-color-scheme` を尊重
- Markdown + Git + Zod スキーマで運用負荷が小さい
- 「面接前後の停止を避ける」が明文化されている

### 主要な懸念

- 採用面接前後の停止リスクへの最後の砦が弱い（GitHub Pages 常時ミラー推奨）
- シークレットローテーション 90 日が個人運用で守られるか（自動 Issue 起票 or 1 年に緩和）
- 年次 DR 訓練が「実演」される現実味（机上確認 + ミラー生存確認に格下げ推奨）
- Skills の「経験年数」のメンテナンス忘れリスク（`since` で自動計算）
- Plausible / Cloudflare Web Analytics の「任意」が機能しなくなる

### スコープ外の発見

- CSP `'unsafe-inline'`（style-src）の根拠（Tailwind なら不要なはず）
- README.md がポートフォリオ本体への入口として機能するか
- `/docs/` の SEO 方針（noindex か否か）

</details>

## 重要度「高」への対応方針案

10 件すべてに対して、修正 / 許容 / 保留のいずれかをオーナーが決定する必要があります。推奨方針：

| # | 推奨対応 | 期限の目安 |
|---|---|---|
| H01 | **修正（即着手）**: `analyzing-requirements` / `analyzing-usecases` で要件・ストーリーを起票 | v0.1 着手前 |
| H02 | **修正**: `planning-releases` でリリース計画を作成、v0.1 = S01 のみに切り詰め | v0.1 着手前 |
| H03 | **修正**: ADR-0003 を起票、ナビ名を「Tech Notes」等に変更、または `noindex` 化 | 設計調整時 |
| H04 | **修正（推奨）**: ADR-0004 で Cloudflare 前段配置を初期構成として採用 | インフラ実装前 |
| H05 | **修正**: Express 構成を最小化、CSP は Astro hydration を許可する設定で具体化 | バックエンド実装前 |
| H06 | **修正**: ADR-0005 でビルド境界を一本化、Heroku から Python Buildpack を除去 | インフラ実装前 |
| H07 | **修正**: ホーム拡張（得意領域タグ + キャッチコピー + 実績ハイライト） | UI 設計の更新 |
| H08 | **修正**: UI 設計のインタラクション表に絞り込み挙動を追記 | UI 設計の更新 |
| H09 | **修正**: Work スキーマに `context / challenge / solution / outcome[]` を追加 | UI 設計とフロントエンド設計の更新 |
| H10 | **修正**: Skill モデルに「現役 / 過去」と Work 逆参照を追加、★ に凡例を付ける | UI 設計の更新 |

## 次のアクション

レビュー完了。重要度「高」項目への対応を以下の順序で進めることを推奨します：

1. **要件・ストーリーの起票**（H01）→ `analyzing-requirements`、`analyzing-usecases` を実行
2. **リリース計画の策定**（H02）→ `planning-releases` を実行、v0.1 を Walking Skeleton に
3. **ADR-0003〜0005 の起票**（H03, H04, H06）→ `creating-adr` を実行
4. **UI 設計の改訂**（H07, H08, H09, H10）→ `analyzing-ui-design` を再実行（途中再開）
5. **Express 構成の見直し**（H05）→ バックエンドアーキテクチャ更新
6. 中・低の項目は v0.1 着手後にイテレーション内で順次対応

## 関連ドキュメント

- [分析成果物（docs/design/）](../design/index.md)
- [ADR 一覧（docs/adr/）](../adr/index.md)
