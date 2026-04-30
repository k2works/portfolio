# イテレーション 4 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-4 |
| **期間** | 2026-04-30（v0.1 リリース完了直後・同日内に前倒し実施・約 1.5 時間で完了） |
| **計画期間** | 2026-05-04 〜 2026-05-10（1 週間） |
| **計画 SP** | 7 |
| **実績 SP** | 7（100%） |
| **計画工数** | 15.3h |
| **実績工数** | 約 1.5h（計画の 9.8%） |

---

## 5 つの問い

### 1. 何ができた？

- **Content Collections + Zod スキーマ**: `apps/web/src/content/config.ts` に works コレクションを定義。US-03 の AC-03-2〜7 とレビュー指摘 M02 / L06 を反映した拡張スキーマ（`summary.max(200)` / `tech.min(1)` / `domain` / `category` / `team_size` / `position` / `involvement` / `demo` / `featured`）。
- **サンプル Works 3 件**: 金融バックエンド（TypeScript / Node.js / AWS）、SaaS フロントエンド（Astro / TypeScript / Tailwind）、EC インフラ自動化（AWS / Terraform / GitHub Actions / Docker）。「課題 → 挑戦 → 解決 → 成果」のストーリー構造で記述。
- **/works/ 一覧画面**: カード形式 + 技術タグフィルタ（URL `?tag=...` 共有可能）+ 件数表示（「N 件中 M 件を表示」）+ 0 件メッセージ + aria-pressed の切替 + 不明タグの URL 正規化（`history.replaceState`）を 1 つの Astro ページに集約。
- **/works/[slug]/ 動的ルーティング**: `getStaticPaths` で全 Works 分の HTML を事前生成。パンくず + プレースホルダ本文 + 「← 一覧に戻る」動線で IT-5 の本実装に備えた土台を整備。
- **E2E 9 シナリオ追加**: `tests/e2e/works.spec.ts` で AC-02-1〜02-8 + 詳細遷移を検証。axe-core via Playwright で `/works/` と `/works/[slug]/` も WCAG 2.1 A/AA violations 0。
- **品質ゲート全グリーン**: `npm run check`（typecheck + lint + format + test）+ `npm run test:e2e`（29 / 29 passed）+ `npm run build`（4 page(s) built）すべて成功。
- **architecture_frontend.md の Content Collections スキーマ例を IT-4 確定版で上書き**: 整合性検証の指摘に従い、設計ドキュメントとコードの乖離を解消。

### 2. 何ができなかった？

- **WorkCard コンポーネントの独立抽出**: タスク 2.2 で計画していたが、Rule of Three（同じパターンが 3 回現れたら抽出）に該当する重複が発生せず（カードは `map` 内の 1 箇所のみ）、`/works/index.astro` 内に inline 実装のまま据え置き。IT-5 で Featured Works（home）と Works 一覧でカードを共有する局面が生まれたら抽出を検討。
- **Lighthouse CI v0.2 予算（Performance ≥ 85）の確認**: ローカルでは未実行（IT-3 同様、main トリガーで実行する設計）。develop マージ後の main → CI 経由で確認する。
- **5 件目以降のサンプル Works**: v0.2 リリース時に 5 件以上が必要（[レビュー指摘](../review/design_review_20260430.md) User Rep）。IT-5 で残り 2 件以上を追加する。

### 3. 学んだこと

- **Astro Content Collections と TypeScript strict の型衝突**: `getCollection("works")` の戻り値が `noUncheckedIndexedAccess` 環境下では各フィールドが `unknown` 扱いになる。`as string[]` 等の明示キャストで対処。Generic 型推論が効きにくい局面は `forEach` + `Set<string>()` で書き下ろすのが堅実。
- **axe-core は `<a aria-pressed>` を許容しない**: ARIA 仕様上、`aria-pressed` は `role="button"` でのみ意味を持つ。`<a>` をフィルタ UI に使う場合は `role="button"` を明示する。Playwright の `getByRole` も「link」→「button」に変わるためテスト側も追従が必要。
- **Playwright の `:visible` セレクタは `style.display = ""` で挙動が不安定**: Flaky 対策には `:not([style*="display: none"])` や `await expect(locator).toHaveCount(N)` の auto-retry を活用するのが安定。`expect(count).toBeLessThan(3)` のように一度値を取り出すと auto-retry が効かないため避ける。
- **整合性検証スキル（validating-iteration-plan）の有用性**: IT-4 計画時に「不明タグの URL 正規化」が AC から漏れていたことを開発前に発見できた。検証なしで実装に進んでいたら、E2E を書く段階で気づいて手戻りになっていた可能性が高い。
- **設計ドキュメント先行 + 個人開発の意思決定速度**: v0.1 同様に圧倒的なスピードで完遂（計画 15.3h → 実績 1.5h、効率 10 倍）。Astro の Content Collections は Markdown 駆動の SSG として圧倒的に書きやすい。

### 4. 次への改善

- **WorkCard の抽出を IT-5 開始時に再評価**: Featured Works（home）と Works 一覧でカードを共有する局面で抽出する。
- **/works/[slug]/ の本実装（US-03）**: IT-5 で 4 ブロック構造（課題 → 挑戦 → 解決 → 成果）+ 外部リンク（GitHub / Demo）+ 業種 / 機能領域 / チーム規模 / ポジション / 関与の深さの表示を実装する。
- **サンプル Works 追加**: IT-5 開始時に 4 件目・5 件目を追加する。実コンテンツへの差し替えは v0.2 リリース直前に。
- **Lighthouse 予算の develop でのスポット計測**: main マージ前にローカル `npm run lhci` で v0.2 予算（Performance ≥ 85）を確認する習慣を導入。

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 実績工数 | 単独ベロシティ |
|---|---:|---:|---:|---|
| IT-1 | 5 | 5 | 約 3h | 1.67 SP/h |
| IT-2 | 7 | 7 | 約 2h | 3.50 SP/h |
| IT-3 | 4 | 4 | 約 2h | 2.00 SP/h |
| IT-4 | 7 | 7 | 約 1.5h | **4.67 SP/h** |
| **累計** | **23** | **23** | **約 8.5h** | **2.71 SP/h** |

> IT-4 単独で過去最高ベロシティを更新（4.67 SP/h）。Astro Content Collections + Zod の構築は型衝突の小さなハマりはあったが、設計が確定していたため実装はスムーズに進んだ。v0.2 標準シナリオ 5 SP/週は「過剰に保守的」と判断できる。

---

## KPT

### Keep（継続すること）

- **設計ドキュメント先行 → 実装** の流れ。実装段階で「何を作るか」を悩む時間がほぼゼロ。
- **整合性検証スキルの利用**: IT-4 計画時にレビュー指摘との整合性を検証 → 開発前に AC の抜けを発見。今後も全イテレーションで実施する。
- **TDD の実用的アレンジ**: SSG では「実装 → E2E → 修正」の小サイクルを高速で回すほうが効率的。E2E を Red で先に書く正統派 TDD は採用ケースを選ぶ。
- **Codex 不使用判断の継続**: 個人開発 + 単純な Astro/Markdown 構造のため、Claude 直接実装で十分。指示往復コストの削減効果が大きい。
- **`npm run format` で format:check 違反を自動修正してからコミット**: フォーマットの一貫性を機械的に担保。

### Problem（問題点）

- **Astro Content Collections の型推論が strict mode と相性が悪い**: `unknown` 推論が複数箇所で発生し、型キャストで回避する必要があった。`getCollection` の戻り値型を明示するヘルパーを書く案あり。
- **axe-core の ARIA ルールでハマった**: `<a aria-pressed>` が違反になる事実を実装後に発見。設計時に ARIA Authoring Practices を確認していれば事前回避できた。
- **WorkCard の抽出を Rule of Three で見送ったが、テストでカード構造が深くなり過ぎた**: 1 箇所での `map` だけど内部が大きい。リファクタリングのタイミングは「3 回」だけでなく「行数」も判断軸に入れるべき。
- **`tests/e2e/works.spec.ts` の Flaky 1 件**: `expect(count).toBeLessThan(3)` で auto-retry が効かなかった。すぐ `toHaveCount(2)` に直して解消したが、Playwright の auto-retry を意識した書き方を習慣化したい。

### Try（次に試すこと）

- **`getCollection` のラッパーヘルパー**: `apps/web/src/lib/content.ts` 等に `getWorks()` を作って型を `Work[]` に固定し、Astro ページ側のキャストを排除。
- **WorkCard の抽出**: IT-5 で home の Featured Works と /works/ の両方でカードを使うので、その時点で `apps/web/src/components/WorkCard.astro` を抽出する。
- **Lighthouse CI のローカル定常実行**: develop コミット前に `npm run lhci` を走らせる Git Hook の導入を検討（[ADR-0006](../adr/0006-heroku-deploy-authentication.md) のような hook 系 ADR を起票するか判断）。
- **ARIA Authoring Practices の参照を設計時の chcekpoint に追加**: 新しい UI コンポーネントを設計するときに該当パターンを WAI-ARIA APG で確認する習慣化。

---

## 数値指標

| 指標 | 値 |
|---|---|
| 計画 SP / 実績 SP | 7 / 7（100%） |
| 計画工数 / 実績工数 | 15.3h / 約 1.5h（9.8%） |
| 実績ベロシティ | 4.67 SP/h（IT-4 単独・累計最高） |
| 累計ベロシティ（IT-1〜IT-4） | 23 SP / 約 8.5h = 2.71 SP/h |
| Vitest テスト数 | 2 passed / 0 failed（変更なし） |
| Playwright E2E シナリオ数 | 29 passed / 0 failed（IT-3 から +11）|
| axe-core violations | 0（/ + /works/ + /works/[slug]/） |
| Astro check errors | 0（`@ts-expect-error` 1 件のみ） |
| ESLint errors | 0 |
| Prettier 違反 | 0（自動修正後緑化） |
| ビルド時間 | 約 1.2 秒（`npm run build`、4 ページ生成） |
| サンプル Works 件数 | 3（v0.2 リリース時の 5 件まで残り 2 件） |

---

## 関連ドキュメント

- [IT-4 計画](./iteration_plan-4.md)
- [IT-3 ふりかえり](./retrospective-3.md)
- [IT-3 完了報告書](./iteration_report-3.md)
- [v0.1 リリース完了報告書](./release_report-0_1_0.md)
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-02 / US-03 / US-13）
- [フロントエンドアーキテクチャ](../design/architecture_frontend.md)（Content Collections スキーマ更新済み）
- [分析成果物レビュー](../review/design_review_20260430.md)（M02 / L06 を反映）

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-04-30 | 初版作成（IT-4 完了直後） | self |
