# イテレーション 5 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-5 |
| **期間** | 2026-04-30（IT-4 完了直後・同日内に前倒し継続実施・約 2 時間で完了） |
| **計画期間** | 2026-05-11 〜 2026-05-17（1 週間） |
| **計画 SP** | 6 |
| **実績 SP** | 6（100%） |
| **計画工数** | 12h |
| **実績工数** | 約 2h（計画の 16.7%） |

---

## 5 つの問い

### 1. 何ができた？

- **/works/[slug]/ の本実装**: パンくず + タイトル / 役職 / 期間 + カバー画像（条件付き）+ メタ情報 `<dl>`（業種 / 機能領域 / チーム規模 / ポジション / 関与の深さ）+ summary + Markdown 本文の `<Content />` 4 ブロックレンダリング + 外部リンク（repo / demo）+ 戻り動線。
- **involvement の日本語ラベル化**: `lead` → 「リード（設計から運用まで主導）」のように業務委託発注検討者が理解しやすい表現に変換する辞書を実装。
- **prose スタイルの軽量自前実装**: Tailwind Typography プラグインを追加せず、`<style is:global>` で `.prose` の最低限スタイル（h2 / h3 / p / table / ul）を定義。バンドルサイズ増を回避。
- **サンプル Works 5 件揃え**: sample-4（医療 / 予約 UI / Astro / Preact）と sample-5（教育 / EdTech / TypeScript / Node.js / GCP）を追加。レビュー指摘 User Rep「公開時に 5 件以上揃え」をクリア。
- **AC-03-7 のスタイル統一**: sample-1〜3 の `## 成果` を Markdown 表形式（`指標 \| Before \| After`）+ 矢印表記の併用に統一。新規 sample-4 / 5 も同じ形式で記述。
- **works-detail.spec.ts 10 シナリオ追加**: AC-03-1〜10 と外部リンク属性を網羅。E2E 全体で 39 シナリオ green。
- **axe-core 継続維持**: /works/[slug]/ の violations 0 を IT-4 から継承。

### 2. 何ができなかった？

- **WorkCard コンポーネントの抽出**: タスク 1.9 で計画したが、Rule of Three（3 回出現したら抽出）に該当しないため見送り。home の Featured Works（IT-1 inline 実装）と /works/ 一覧（IT-4 実装）はカードの見た目とスコープが異なり、共有化のメリットが薄い。v0.3 / v1.0 で home を再設計するときに再評価する。
- **Lighthouse CI v0.2 予算（Performance ≥ 85）のローカル確認**: IT-4 同様、main トリガーで実行する設計。develop マージ後の main → CI 経由で確認する。
- **summary が表として `<dl>` の中に入っていない**: ui_design.md S03 の salt 図では「概要」セクションが独立。実装は独立した `<section>` で表現したが、salt 図とは少しレイアウトが異なる（縦に長くなる）。デザイン的には改良余地あり、v0.3 で再評価。

### 3. 学んだこと

- **Astro Content の `entry.render()` は素直に動く**: `await work.render()` で `Content` を取り出して `<Content />` で配置するだけ。Markdown 内の見出し（`## 課題` 等）が `<h2>` として正しくレンダリングされる。Tailwind の Typography プラグインなしでも、`<style is:global>` で 30 行程度の prose 風スタイルで読める形になる。
- **`<dl>` (definition list) は role=group ではない**: Playwright の `getByRole("group", { name: ... })` で取れない。代わりに aria-label を付けて `locator('[aria-label="..."]')` で検証する。最初は role=group で書いて lint で `'meta' is assigned but never used` エラーになった。
- **Astro のコメントアウトを残すと ESLint が unused warning を発する**: `// const meta = ...` のような途中まで書いた変数は必ず削除する。pre-commit hook がない以上、`npm run check` をこまめに走らせる習慣が安全。
- **既存サンプルの修正コストは低いがレビュー価値が高い**: sample-1〜3 の `## 成果` を表形式に統一する作業（タスク 1.8）は 5 分程度だが、AC-03-7 の「定量指標 (before/after) 形式」を機械検証可能にする効果が大きかった。works-detail.spec.ts のテーブル検証で AC-03-7 を担保できた。
- **整合性検証スキルの効用が連続 2 回**: IT-4 で 2 件、IT-5 で 2 件の不整合を開発前に発見。実装中に AC の解釈で迷う時間がほぼゼロ。

### 4. 次への改善

- **v0.2 リリース準備**: IT-5 で v0.2 のコードが完成。次は main への PR + `v0.2.0` タグ + リリース完了報告書（`creating-release-report` スキル）。
- **Featured Works の home 連動**: home の Featured Works 3 件は IT-1 で「TypeScript / Java / Cloudflare」のプレースホルダだが、実コンテンツは `featured: true` の Works（現状 sample-1 と sample-2）。v0.3 / v1.0 で home の hero セクションを再設計するときに `getCollection("works", (e) => e.data.featured)` で動的化する。
- **Lighthouse CI 予算の本格運用**: develop でも `npm run lhci` をスポット実行する習慣を身につける。Git Hook（husky 等）の導入は IT-1 で却下したが、再検討の余地あり。
- **WorkCard 抽出の判断基準を明文化**: 「3 回出現」「100 行を超える」「共有化で 50 行削減」のような複数軸で判断するガイドを `docs/reference/コーディングとテストガイド.md` に追記する案あり。

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 実績工数 | 単独ベロシティ |
|---|---:|---:|---:|---|
| IT-1 | 5 | 5 | 約 3h | 1.67 SP/h |
| IT-2 | 7 | 7 | 約 2h | 3.50 SP/h |
| IT-3 | 4 | 4 | 約 2h | 2.00 SP/h |
| IT-4 | 7 | 7 | 約 1.5h | 4.67 SP/h |
| IT-5 | 6 | 6 | 約 2h | **3.00 SP/h** |
| **累計** | **29** | **29** | **約 10.5h** | **2.76 SP/h** |

> IT-5 は IT-4 のピーク（4.67 SP/h）からは下がったが、サンプル Works のテキスト作成（sample-4 / sample-5）が時間のかかる作業として影響。実装ロジック自体は IT-4 のスキャフォールドを再利用できたため、純粋なコーディング時間は短い。v0.2 リリースまでに **29 SP / 10.5h = 2.76 SP/h** という実績が確定。

---

## KPT

### Keep（継続すること）

- **整合性検証スキル（validating-iteration-plan）の利用**: 連続 2 回で計 4 件の不整合を発見。今後のイテレーションでも全件で実施。
- **設計ドキュメント先行 → 実装** の流れ: IT-1〜IT-5 通して、実装段階で「何を作るか」を悩む時間がほぼゼロ。
- **TDD の実用的アレンジ**: SSG では「実装 → E2E → 修正」の小サイクルが効率的。E2E を Red で先に書く正統派 TDD は採用ケースを選ぶ。IT-5 でも works-detail.spec.ts は実装後に書いた。
- **既存サンプルの統一作業を計画タスクに含める**: タスク 1.8 のような「既存資産のクリーンアップ」を計画段階で明示しておくと、整合性のあるリリースに繋がる。
- **`npm run format` で format:check 違反を自動修正してからコミット**: フォーマットの一貫性を機械的に担保。

### Problem（問題点）

- **`<dl>` の role 検証で詰まった**: `<dl>` は role=group ではない。最初に書いた `getByRole("group", ...)` がエラーになり、その変数を削除し忘れて ESLint で no-unused-vars エラーに。`<dl>` のセマンティクスを事前確認すべきだった。
- **Astro の `<style is:global>` 内の `var(--color-tag-bg)` がスコープ外で効く保証がない**: 動作上は OK だが、ベストプラクティスから言えば Tailwind の `data-[*]` 属性等で表現するほうがメンテナンス性が高い。
- **404 シナリオの実装が Astro SSG + Express server.js で複雑**: `/works/non-existent/` でのテスト（AC-03-10）は Express の 404 fallback 経由で動作するが、Astro 単体（`npm run preview`）と Heroku 上での挙動が微妙に異なる。Playwright のテストは「200 レスポンスでも非対象 work のページではない」を検証する形で妥協した。
- **WorkCard 抽出の見送り判断にやや時間を要した**: 抽出コストと共有化メリットの比較で躊躇。Rule of Three を機械的に当てはめる方が判断速度は上がる。

### Try（次に試すこと）

- **v0.2 リリース完了報告書の作成**: IT-5 完了後すぐに `creating-release-report` スキルを呼んで v0.2.0 をリリース締切する。
- **Featured Works の動的化（v0.3 検討）**: home の hero セクションで `getCollection("works", (e) => e.data.featured)` を使い、Markdown だけの編集で Featured が反映される構造に。
- **`docs/reference/コーディングとテストガイド.md` への "WorkCard 抽出判断基準" 追記**: 次のリファクタリング判断時に参照できるよう、Rule of Three + 行数 + 共通化メリットの 3 軸で判断するガイドを追加。
- **Lighthouse CI のローカル定常実行**: タスク 3.3 で見送ったが、main マージ前に確認する習慣を確立する。

---

## 数値指標

| 指標 | 値 |
|---|---|
| 計画 SP / 実績 SP | 6 / 6（100%） |
| 計画工数 / 実績工数 | 12h / 約 2h（16.7%） |
| 実績ベロシティ | 3.00 SP/h（IT-5 単独） |
| 累計ベロシティ（IT-1〜IT-5） | 29 SP / 約 10.5h = 2.76 SP/h |
| Vitest テスト数 | 2 passed / 0 failed（変更なし） |
| Playwright E2E シナリオ数 | 39 passed / 0 failed（IT-4 から +10）|
| axe-core violations | 0（/ + /works/ + /works/[slug]/） |
| Astro check errors | 0（`@ts-expect-error` 1 件のみ） |
| ESLint errors | 0 |
| Prettier 違反 | 0（自動修正後緑化） |
| ビルド時間 | 約 1.3 秒（`npm run build`、7 ページ生成） |
| サンプル Works 件数 | 5（v0.2 リリース基準達成） |
| ビルド出力ページ数 | 7（/、/works/、/works/sample-{1..5}/） |

---

## 関連ドキュメント

- [IT-5 計画](./iteration_plan-5.md)
- [IT-4 ふりかえり](./retrospective-4.md)
- [IT-4 完了報告書](./iteration_report-4.md)
- [v0.1 リリース完了報告書](./release_report-0_1_0.md)
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-03）
- [UI 設計](../design/ui_design.md)（S03）
- [フロントエンドアーキテクチャ](../design/architecture_frontend.md)（Content Collections）
- [分析成果物レビュー](../review/design_review_20260430.md)（H09 / M02 / L06 反映済み）

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-04-30 | 初版作成（IT-5 完了直後） | self |
