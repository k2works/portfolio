# イテレーション 6 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-6 |
| **期間** | 2026-05-01（v0.2 リリース直後・同日内に前倒し継続実施・約 1.5 時間で完了） |
| **計画期間** | 2026-05-18 〜 2026-05-24（1 週間） |
| **計画 SP** | 7 |
| **実績 SP** | 7（100%） |
| **計画工数** | 14h |
| **実績工数** | 約 1.5h（計画の 10.7%） |

---

## 5 つの問い

### 1. 何ができた？

- **Skills Content Collection の実装**: `category` / `name` / `since` / `status` / `level` / `works[]` / `order` を持つ Zod スキーマと、サンプル 15 件（Backend 4 + Frontend 3 + Infrastructure 4 + Practice 4）を投入。
- **/skills/ ページ実装**: 4 カテゴリ別カード + 凡例（★1〜5 の意味付け）+ 経験年数自動計算 + 現役/過去ステータス + 関連 Work 逆参照リンク + ハッシュ URL（`/skills/#java-spring`）スクロール対応。
- **Practice カテゴリの差別表示**: 他カテゴリ（カードグリッド形式）と異なり、横並びチップ形式で表示（ui_design.md S04 salt 図に準拠）。
- **ダークモード切替の実装**: Tailwind `darkMode: "class"` + `:root.dark` カスタムプロパティ上書き + `<head>` 内 inline script による FOUC 回避 + ThemeToggle コンポーネント。
- **localStorage 永続化 + prefers-color-scheme 尊重**: 初回訪問時はシステム設定、その後はユーザー選択を `localStorage.theme` で保持。
- **View Transitions API 退化的フォールバック**: `startViewTransition` 対応ブラウザ（Chrome 111+）では切替アニメーション、未対応ブラウザは即時切替。
- **axe-core 拡張**: `/skills/` + ダークモード時のホーム + ダークモード時の Skills で WCAG 2.1 A/AA violations 0 を担保（5 → 8 シナリオに）。
- **theme.spec.ts 5 シナリオ**: AC-07-1〜5 をすべて網羅する E2E。

### 2. 何ができなかった？

- **ナビ全要素の dark: バリアント明示適用**: 既存 BaseLayout のクラス指定は `var(--color-*)` 経由で動的に切り替わるため、Tailwind の `dark:` バリアントを明示的に追加する必要は最小限で済んだ。逆に言えば、`.dark` を付けるだけで切り替わる設計に揃えていた v0.1 設計の判断が今回効いた。本イテレーション中で意識的に修正したのは Skills の「過去」バッジ（コントラスト不足のため `opacity-60` を除去）のみ。
- **Lighthouse CI v0.3 予算（A11y ≥ 92）のローカル確認**: タスク 3.1 はローカル `npm run lhci` 実行を計画したが、main マージ後の CI ベースで検証する方針へ振り替え。ローカル実行は Heroku Eco Dyno のスコアぶれを再現するため、CI 環境（lighthouserc.json）での計測を優先。
- **Skills の凡例 region role 検証**: 当初 `getByRole("region", { name: "凡例" })` で取れることを期待していたが、Astro の section/h2 構造は `region` ロールとして自動認識されないため、`section[aria-labelledby='legend-heading'] li` で代替検証に切替。

### 3. 学んだこと

- **`opacity-60` でコントラストが 4.5:1 を割る**: 「過去」バッジを薄表示するために `opacity-60` を使ったが、axe-core で `color-contrast` 違反（4.2:1）を検出。WCAG AA は normal text で 4.5:1 必須なので、不透明度ではなく `border + italic` のような視覚区別に変更すべき。今回は実装と axe-core を 1 回回したことで即時発見。
- **inline script は `is:inline` を明示する**: BaseLayout の `<script>` を Astro が処理（バンドル化）すると `<head>` 評価前に走らず FOUC が発生する可能性がある。`<script is:inline>` で確実に inline 化される。
- **Playwright の locator は lazy 評価**: ボタンの `aria-label` がクリック後に変わると、再 query で見つからなくなる。`aria-label` ベースの取得ではなく、`#theme-toggle` のような不変 ID を使う方が堅牢。同じパターンを IT-3 のハンバーガーで踏んでいた（Esc キーで閉じるテスト）が、今回も再発。
- **Playwright `addInitScript` は新規ナビゲーションごとに走る**: `addInitScript` で localStorage を初期化すると、`page.reload()` でも実行されてしまい、リロード後の状態が壊れる。永続化テストは `browser.newContext({ colorScheme })` でクリーンなコンテキストを作る方が安全。
- **CSS カスタムプロパティ + `darkMode: "class"` の相性が良い**: `:root` でデフォルト値、`:root.dark` で上書きすれば、Tailwind の `dark:` バリアントを各クラス指定に書かなくても、CSS 変数経由で全体が切り替わる。設計コストが大幅に下がった。

### 4. 次への改善

- **WorkCard / SkillCard の共通化**: home の Featured Works（hardcode）と /works/ 一覧（カード）と /skills/ のスキルカード（似た構造）が 3 箇所になった。Rule of Three を満たしたので、IT-7 で `Card.astro` 抽出を検討する。
- **`/skills/#anchor` のスクロールマージン微調整**: モバイル sticky ヘッダーが `h-12 py-3` 程度で 60px ほど。`scroll-mt-24`（=96px）は十分だが、デザイン次第で `scroll-mt-16` に縮められる可能性。
- **ThemeToggle のキーボードショートカット**: 現状はヘッダーのトグルボタン経由のみ。`Shift + D` などのショートカット対応は将来課題（v1.0 a11y 強化で検討）。
- **Lighthouse v0.3 予算（A11y ≥ 92）の自動化されたローカル確認**: develop push 前に `npm run lhci` を回すワークフローを定着させたい。`pre-push` hook の導入を再検討するきっかけ。

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 実績工数 | 単独ベロシティ |
|---|---:|---:|---:|---|
| IT-1 | 5 | 5 | 約 3h | 1.67 SP/h |
| IT-2 | 7 | 7 | 約 2h | 3.50 SP/h |
| IT-3 | 4 | 4 | 約 2h | 2.00 SP/h |
| IT-4 | 7 | 7 | 約 1.5h | 4.67 SP/h |
| IT-5 | 6 | 6 | 約 2h | 3.00 SP/h |
| IT-6 | 7 | 7 | 約 1.5h | **4.67 SP/h** |
| **累計** | **36** | **36** | **約 12h** | **3.00 SP/h** |

> IT-6 は IT-4 と並ぶピーク（4.67 SP/h）。設計先行（ui_design S04 + ダークモード規約 + content/config.ts に skills を追加するだけの単純拡張）と既存 CSS カスタムプロパティ設計の相乗効果が出た。axe-core で contrast 違反を 1 回発見・修正したが、検出から修正まで 5 分以内で完了。

---

## KPT

### Keep（継続すること）

- **設計ドキュメント先行 → 実装** の流れ（IT-1〜IT-6 通して効果的）。IT-6 では事前に「Featured Work 選定基準を明文化」「ui_design 画面遷移図に S04 ↔ S03 を反映予定」と注記したことで、実装中の手戻りなし。
- **整合性検証スキル（validating-iteration-plan）**: IT-6 でも軽微 2 件を検出（ui_design 反映点 / L08 タッチターゲット）。継続使用。
- **axe-core を実装直後に必ず回す**: contrast 違反のような視覚バグを最速で検出。
- **`#id` ベースの locator**: aria-label が動的変化する要素は `#id` で取る。
- **CSS カスタムプロパティ + `:root.dark`**: ダークモードの実装コストが激減。`dark:` バリアントを各クラスに散らさない。

### Problem（問題点）

- **`opacity-60` でコントラスト不足**: 「視覚的に薄くする」目的でアクセシビリティを犠牲にしないルールを徹底する。
- **ボタン aria-label 動的変化テスト**: IT-3 のハンバーガーでも踏んでいた問題。`#id` 取得をテンプレ化する。
- **ローカル Windows 環境の改行コード問題（v0.2 から継続）**: Phase 1〜2 のコミット時にも複数の `LF will be replaced by CRLF` 警告。`.gitattributes` の拡張は v0.3 リリース完了後の優先タスクに上げる。

### Try（次に試すこと）

- **IT-7 で Card.astro を抽出**: home Featured + /works/ + /skills/ の 3 箇所で Rule of Three 達成。
- **`pre-push` hook で `npm run lhci` を回す**: ローカルで Lighthouse 予算違反を発見できるようにする。または `--lighthouse-skip` ラベル運用と組み合わせて警告のみに留める。
- **`.gitattributes` 拡張**: `*.astro` `*.ts` `*.json` `*.md` に `text eol=lf` を指定。Windows 環境での autocrlf 衝突を恒久解消。

---

## 数値指標

| 指標 | 値 |
|---|---|
| 計画 SP / 実績 SP | 7 / 7（100%） |
| 計画工数 / 実績工数 | 14h / 約 1.5h（10.7%） |
| 実績ベロシティ | 4.67 SP/h（IT-6 単独・IT-4 と並ぶピーク） |
| 累計ベロシティ（IT-1〜IT-6） | 36 SP / 約 12h = 3.00 SP/h |
| Vitest テスト数 | 2 passed / 0 failed（変更なし） |
| Playwright E2E シナリオ数 | 52 passed / 0 failed（IT-5 時点 39 から +13: skills 5 + theme 5 + a11y +3）|
| axe-core violations | 0（/ + /works/ + /works/[slug]/ + /skills/ + ダークモード時のホーム / Skills） |
| Astro check errors | 0 |
| ESLint errors | 0 |
| Prettier 違反 | 0（ローカル CRLF 警告は環境依存、CI Linux では緑） |
| ビルド時間 | 約 1.4 秒（`npm run build`、15 ページ生成） |
| サンプル Skills 件数 | 15（Backend 4 + Frontend 3 + Infrastructure 4 + Practice 4） |
| ビルド出力ページ数 | 15（/、/works/、/works/sample-{1..5}/、/works/{ec/corporate/case/getting/practical}*/、/skills/、/404） |

---

## 関連ドキュメント

- [IT-6 計画](./iteration_plan-6.md)
- [IT-5 ふりかえり](./retrospective-5.md)
- [IT-5 完了報告書](./iteration_report-5.md)
- [v0.2 リリース完了報告書](./release_report-0_2_0.md)
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-04 / US-07）
- [UI 設計](../design/ui_design.md)（S04 / ダークモード切替）
- [フロントエンドアーキテクチャ](../design/architecture_frontend.md)
- [分析成果物レビュー](../review/design_review_20260430.md)（H10 / L07 / L08 / L09 反映済み）

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-05-01 | 初版作成（IT-6 完了直後） | self |
