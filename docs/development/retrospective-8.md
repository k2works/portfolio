# イテレーション 8 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-8 |
| **期間** | 2026-05-01（IT-7 完了直後・同日内に前倒し継続実施・約 30 分で完了） |
| **計画期間** | 2026-06-01 〜 2026-06-07（1 週間） |
| **計画 SP** | 5 |
| **実績 SP** | 5（100%） |
| **計画工数** | 8.3h |
| **実績工数** | 約 0.5h（計画の 6.0%） |

---

## 5 つの問い

### 1. 何ができた？

- **キーボード操作 E2E 16 シナリオ**: 6 ページ（/, /works/, /works/sample-1/, /skills/, /books/, /contact/）で AC-10-1（Tab 進行 / Contact 連絡チャネル到達）+ AC-10-2（focus-visible:outline クラス検証）+ AC-10-3（スキップリンク + Tab 最初フォーカス）+ AC-10-4（header / nav / main / footer ランドマーク）を網羅。
- **フォーカストラップ実装**: `BaseLayout.astro` のハンバーガーメニュー展開時、Tab で nav 内最後 → 最初へループ + Shift+Tab で最初 → 最後へ逆順ループ。`getFocusables()` で disabled / 非表示要素を除外して安全に動作。既存の Esc 閉じる動作と共存。
- **focus-trap.spec.ts 3 シナリオ**: AC-10-5 の Tab ループ + Shift+Tab 逆順 + Esc 閉じてフォーカスがトグルに戻る を網羅。
- **Lighthouse v1.0 予算引き上げ**: `lighthouserc.json` を Performance ≥ 0.85 / SEO ≥ 0.95 / **Accessibility ≥ 0.95** / Best Practices ≥ 0.92 に更新。A11y は v0.3 0.92 → v1.0-α 0.95 へ。
- **NVDA / VoiceOver 手動検証手順を runbook 化**: `docs/operation/a11y_manual_check.md` 新規作成。検証項目 MA-1〜9（スキップリンク / ランドマーク / 見出し / 外部リンク警告 / フォーカス可視化 / ハンバーガー / ダーク / 連絡チャネル / フィルタ）+ 6 ページの確認ポイント + 結果記録テンプレート。
- **ホーム画面の Content Collections 連動**: IT-7 retrospective の Try「ホーム再設計時に Featured Works を動的化」を回収。Featured Works を `getCollection("works", w => w.data.featured)` で実 3 件、Skills Highlights を Skills Content Collection からカテゴリ別に集計。Books セクションも追加。

### 2. 何ができなかった？

- **NVDA / VoiceOver 手動検証の実施**: 手順は runbook 化したが、実環境（Windows / macOS）での実検証は v1.0 リリース直前 + 四半期運用に持ち越し。今回は「自動 axe-core で違反 0」+「手順の整備」までを完了範囲とする。
- **Lighthouse v1.0 予算（A11y ≥ 0.95）の main 実測確認**: IT-8 単独では main マージしないため、IT-9 完了時に v1.0 リリースとして併合実施。IT-7 までの実績で A11y ≥ 0.92 だった水準が 0.95 に届くかは IT-9 で初めて検証される。
- **Card.astro 共通化**: ホームの Featured Works を実データ連動にしたが、`<article>` 構造は /works/ 一覧の `<li class="border ...">` と微妙に異なるため、Rule of Three の整合判断は v1.0 リリース後の運用フェーズに持ち越し。

### 3. 学んだこと

- **Playwright `for-of` で動的 describe を生成する基本パターン**: keyboard.spec.ts で 6 ページを `for (const url of PAGES_TO_VERIFY)` で展開し、AC ごとに describe を分けたことで、AC ↔ シナリオの 1:1 対応が読み取りやすい構成に。今後の WCAG / a11y 拡張で同パターンが使える。
- **フォーカストラップの実装は意外に短い**: `getFocusables()` で nav 内のフォーカス可能要素を取得し、最初と最後で Tab / Shift+Tab を preventDefault するだけで実装可能。複雑なライブラリ（focus-trap-react 等）を導入せずに 30 行程度で達成できた。
- **Astro Content Collections の効用**: ホーム画面の Featured Works を 3 行のコード（getCollection + filter + sort + slice）で動的化できた。ハードコードのサンプル削除と同時にコード行数も微増のみで、保守性が大幅に向上。
- **Lighthouse の段階引き上げ戦略**: 全項目を一度に v1.0 予算に上げるのではなく、A11y のみ 0.95 に先行引き上げ + Performance / SEO / BP は段階的に上げることで、CI 失敗リスクを分散できた。

### 4. 次への改善

- **IT-9 で v1.0 リリース確定**: US-11（Tech Notes 同居）+ US-12（OGP 自動生成）+ Lighthouse v1.0 予算（残 P / SEO / BP の 0.9 / 0.95 / 0.95 への引き上げ）+ main マージ + v1.0.0 タグ。残 5 SP / 想定 0.7h（IT-7 ピーク 7.00 SP/h ベース）。
- **NVDA / VoiceOver 手動検証の実施**: v1.0 リリース直前または直後に runbook の手順を実行し、結果を `docs/operation/a11y_manual_check_v1.0.md` に記録する。
- **Card.astro 共通化の判断を v1.0 リリース後に再評価**: home Featured / /works/ 一覧 / /skills/ 関連 Work 逆参照 / /books/ の 4 箇所のカード構造を比較し、共通点が増えていれば抽出する。

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 実績工数 | 単独ベロシティ |
|---|---:|---:|---:|---|
| IT-1 | 5 | 5 | 約 3h | 1.67 SP/h |
| IT-2 | 7 | 7 | 約 2h | 3.50 SP/h |
| IT-3 | 4 | 4 | 約 2h | 2.00 SP/h |
| IT-4 | 7 | 7 | 約 1.5h | 4.67 SP/h |
| IT-5 | 6 | 6 | 約 2h | 3.00 SP/h |
| IT-6 | 7 | 7 | 約 1.5h | 4.67 SP/h |
| IT-7 | 7 | 7 | 約 1h | 7.00 SP/h |
| IT-8 | 5 | 5 | 約 0.5h | **10.00 SP/h** |
| **累計** | **48** | **48** | **約 13.5h** | **3.56 SP/h** |

> IT-8 は IT-7 のピーク 7.00 SP/h を上回る **10.00 SP/h**（全イテレーション中ピーク更新）。要因は (1) 既存実装（スキップリンク / ランドマーク / focus-visible）が v0.1 から準備済みでテストを書くだけだった、(2) フォーカストラップ実装が 30 行程度の小規模、(3) pre-commit hook + .gitattributes で品質ゲートが堅牢化され手戻りゼロ、(4) ホーム画面の Content Collections 連動も Featured フラグの選定基準を IT-5 で明文化済みだったため迷いがなかった。

---

## KPT

### Keep（継続すること）

- **整合性検証スキル（validating-iteration-plan）の利用**: IT-6〜IT-8 の 3 連続で計 7 件の不整合を計画作成直後に発見・解消。
- **pre-commit hook + .gitattributes の運用**: IT-7〜IT-8 期間中に CI 失敗ゼロ。
- **設計ドキュメント先行 → 実装** の流れ（IT-1〜IT-8 通して効果的）。
- **`#id` ベースの locator + `browser.newContext` でクリーンな状態**: IT-6 / IT-7 / IT-8 で一貫して採用。
- **小規模な実装ファースト → 既存仕様のテスト網羅**: IT-8 はほぼテスト追加が中心で、フォーカストラップだけ実装追加。短時間で広いカバレッジを獲得。

### Problem（問題点）

- **NVDA / VoiceOver 手動検証は環境依存で実施タイミングが難しい**: runbook 化はできたが、実検証は v1.0 直前まで持ち越し。検証履歴が残らない期間がある。
- **A11y 自動検証だけでは「読み上げ順序の論理性」を完全には担保できない**: axe-core で violations 0 でも、見出し階層の論理性 / aria-label の自然さは目視 / 耳での確認が必要。
- **ホーム画面の Featured Works が hardcode 期間が長かった**: IT-1 から IT-7 までずっとプレースホルダ。Featured 選定基準を IT-5 で明文化したが、実装は IT-8 まで遅延。

### Try（次に試すこと）

- **IT-9 で US-11（Tech Notes）+ US-12（OGP）+ v1.0 リリース実行**: 残 5 SP を一気通貫で完了。
- **v1.0 リリース直前に NVDA / VoiceOver 手動検証を実施**: runbook の MA-1〜9 を全 6 ページで実行し、結果を `docs/operation/a11y_manual_check_v1.0.md` に記録。
- **Card.astro 共通化判断を v1.0 リリース後に再評価**: home Featured / /works/ / /skills/ 関連 Work / /books/ の 4 箇所のカード構造を比較。
- **Lighthouse 予算の段階引き上げの記録化**: 「v0.1 → v0.2 → v0.3 → v1.0 で A11y を 0.9 → 0.92 → 0.95 と段階引き上げ」という運用パターンを `docs/reference/Lighthouse 予算の段階引き上げ戦略.md` 等に明文化する案。

---

## 数値指標

| 指標 | 値 |
|---|---|
| 計画 SP / 実績 SP | 5 / 5（100%） |
| 計画工数 / 実績工数 | 8.3h / 約 0.5h（6.0%） |
| 実績ベロシティ | 10.00 SP/h（IT-8 単独・全イテレーション中ピーク） |
| 累計ベロシティ（IT-1〜IT-8） | 48 SP / 約 13.5h = 3.56 SP/h |
| Vitest テスト数 | 2 passed / 0 failed（変更なし） |
| Playwright E2E シナリオ数 | 95 passed / 0 failed（IT-7 時点 76 → +19: keyboard 16 + focus-trap 3） |
| axe-core violations | 0（全画面 + ダークモード時で WCAG 2.1 A/AA） |
| Astro check errors | 0 |
| ESLint errors | 0（warnings 6 件: server.js 2 + books / skills の max-lines 系） |
| Prettier 違反 | 0（pre-commit hook で自動整形） |
| ビルド時間 | 約 1.5 秒（`npm run build`、19 ページ生成） |
| Lighthouse 予算 | v0.1 0.8/0.9/0.9/0.9 → v1.0-α **0.85/0.95/0.95/0.92**（A11y 先行引き上げ） |
| ビルド出力ページ数 | 19（変更なし） |
| ホーム画面の動的化 | Featured Works 3 件 + Skills Highlights 9 件（3 カテゴリ × 3 件）が Content Collections 連動 |

---

## 関連ドキュメント

- [IT-8 計画](./iteration_plan-8.md)
- [IT-7 ふりかえり](./retrospective-7.md)
- [IT-7 完了報告書](./iteration_report-7.md)
- [v0.3 リリース完了報告書](./release_report-0_3_0.md)
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-10）
- [UI 設計](../design/ui_design.md)（共通レイアウト + インタラクション）
- [非機能要件](../design/non_functional.md)（Lighthouse v1.0 予算）
- [アクセシビリティ手動検証手順](../operation/a11y_manual_check.md)（IT-8 で新規作成）

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-05-01 | 初版作成（IT-8 完了直後） | self |
