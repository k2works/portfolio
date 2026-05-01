# イテレーション 8 計画

## 概要

| 項目 | 内容 |
|------|------|
| **イテレーション** | 8（v1.0-α） |
| **期間** | Week 8（1 週間想定） / 計画期間 2026-06-01 〜 2026-06-07 |
| **ゴール** | US-10（キーボード / スクリーンリーダーで全機能にアクセスできる）を実装し、Lighthouse v1.0 予算（A11y ≥ 95）を達成して v1.0-α として「アクセシビリティ要件を満たした状態」を作る |
| **目標 SP** | 5 |

---

## ゴール

### イテレーション終了時の達成状態

1. **キーボード操作の全画面網羅**: Tab で全インタラクティブ要素に到達でき、フォーカスは `:focus-visible` でリング表示される。スキップリンクが存在し、ランドマーク（`<header> / <nav> / <main> / <footer>`）が全画面で配置される
2. **ハンバーガーメニューのフォーカストラップ**: 展開時はメニュー内でフォーカスがループし、Esc で閉じる + body スクロール抑止が継続して動作する
3. **axe-core 全画面 violations 0 + Lighthouse A11y ≥ 95**: 全 6 ページ（/ / /works/ / /works/[slug]/ / /skills/ / /books/ / /contact/）+ ダークモード時で WCAG 2.1 A/AA violations 0、Lighthouse v1.0 予算の A11y ≥ 95 を達成

### 成功基準

- [ ] AC-10-1〜AC-10-5 が全て達成される
- [ ] Playwright E2E が全て緑（既存 76 + キーボード操作 5 + フォーカストラップ 3）
- [ ] axe-core via Playwright で全画面 + ダークモード時の violations が 0（既存維持）
- [ ] Lighthouse v1.0 予算（Performance ≥ 90 / SEO ≥ 95 / A11y ≥ 95 / BP ≥ 95）達成
- [ ] NVDA（または VoiceOver）で主要画面（home / works / skills / books / contact）の手動検証完了

---

## ユーザーストーリー

### 対象ストーリー

| ID | ユーザーストーリー | SP | 優先度 |
|----|-------------------|----|----|
| US-10 | キーボード / スクリーンリーダーで全機能にアクセスできる | 5 | 必須 |
| **合計** | | **5** | |

### ストーリー詳細

#### US-10: キーボード / スクリーンリーダーで全機能にアクセスできる

**ストーリー**:
> 多様な訪問者（キーボード操作者、スクリーンリーダー利用者）として、マウスを使わずに全コンテンツに到達したい。なぜなら、アクセシビリティ要件を満たし、誰でもポートフォリオを評価できるからだ。

**受入条件**:

1. AC-10-1: Tab で全インタラクティブ要素にフォーカスできる
2. AC-10-2: フォーカスは `:focus-visible` でリング表示される
3. AC-10-3: スキップリンク（"メインへ移動"）が存在する
4. AC-10-4: `<header> / <nav> / <main> / <footer>` のランドマークが配置される
5. AC-10-5: ハンバーガーメニュー展開時はフォーカストラップ + Esc で閉じる + body スクロール抑止

### タスク

#### 1. キーボード操作 E2E（AC-10-1 / 2 / 3 / 4 / 4 SP）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 1.1 | `tests/e2e/keyboard.spec.ts` 新規作成（Tab で全インタラクティブ要素を順次フォーカスできることを 6 ページで確認） | 1.5h | self | [ ] |
| 1.2 | スキップリンクの存在 + Tab で最初にフォーカスされ + Enter で `#main` へジャンプを 6 ページで検証 | 0.5h | self | [ ] |
| 1.3 | ランドマーク（`<header> / <nav> / <main> / <footer>`）の存在を 6 ページで検証 | 0.5h | self | [ ] |
| 1.4 | `:focus-visible` リング表示の検証（フォーカス状態の outline 値を boundingBox で取得 + class でアサート） | 1.0h | self | [ ] |
| 1.5 | キーボード操作で外部リンクを Enter で開ける動作確認（target=_blank の場合） | 0.5h | self | [ ] |

**小計**: 4.0h（理想時間）

#### 2. フォーカストラップ + 詳細検証（AC-10-5 / 1 SP）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 2.1 | ハンバーガーメニュー展開時のフォーカストラップ実装確認 + 必要なら BaseLayout に追加 | 1.0h | self | [ ] |
| 2.2 | `tests/e2e/focus-trap.spec.ts` 新規作成（メニュー内で Tab がループ + 最後の要素で Tab → 最初の要素 + Shift+Tab で逆順） | 1.0h | self | [ ] |
| 2.3 | NVDA / VoiceOver の手動検証手順を `docs/operation/runbooks/a11y-manual-check.md` に明文化 | 0.5h | self | [ ] |

**小計**: 2.5h（理想時間）

#### 3. Lighthouse v1.0 予算引き上げ + 横断（0 SP / バッファ）

| # | タスク | 見積もり | 担当 | 状態 |
|---|--------|---------|------|------|
| 3.1 | `apps/web/lighthouserc.json` の予算を v1.0 値（P≥90 / SEO≥95 / A11y≥95 / BP≥95）に引き上げ | 0.3h | self | [ ] |
| 3.2 | main CI で Lighthouse v1.0 予算達成を確認（v1.0 リリース時にも再確認） | 0.5h | self | [ ] |
| 3.3 | ふりかえり（retrospective-8.md）+ 完了報告書（iteration_report-8.md） | 1.0h | self | [ ] |

**小計**: 1.8h（理想時間）

#### タスク合計

| カテゴリ | SP | 理想時間 | 状態 |
|---------|----|----|------|
| キーボード操作 E2E（US-10 / AC-10-1〜4） | 4 | 4.0h | [ ] |
| フォーカストラップ + 詳細検証（US-10 / AC-10-5） | 1 | 2.5h | [ ] |
| Lighthouse v1.0 予算引き上げ + 締め | 0 | 1.8h | [ ] |
| **合計** | **5** | **8.3h** | |

**1 SP あたり**: 約 1.66h（横断除く）
**進捗率**: 0% (0/5 SP)

---

## スケジュール

### Week 1（Day 1-7）

```mermaid
gantt
    title イテレーション 8 - Week 1
    dateFormat  YYYY-MM-DD
    section A11y E2E
    keyboard.spec.ts 新規              :d1, 2026-06-01, 1d
    スキップリンク + ランドマーク      :d2, after d1, 1d
    :focus-visible + 外部リンク        :d3, after d2, 1d
    section フォーカストラップ
    BaseLayout 確認 + 必要なら追加     :u1, after d3, 1d
    focus-trap.spec.ts                 :u2, after u1, 1d
    NVDA / VoiceOver 手動検証手順      :u3, after u2, 1d
    section Release
    Lighthouse v1.0 予算引き上げ + 締め :r1, after u3, 1d
```

| 日 | タスク |
|----|--------|
| Day 1 | 1.1 keyboard.spec.ts |
| Day 2 | 1.2 スキップリンク + 1.3 ランドマーク |
| Day 3 | 1.4 :focus-visible + 1.5 外部リンク |
| Day 4 | 2.1 フォーカストラップ実装確認 + 2.2 focus-trap.spec.ts |
| Day 5 | 2.3 NVDA / VoiceOver 手動検証手順書 |
| Day 6 | 3.1 Lighthouse 予算引き上げ + 3.2 確認 |
| Day 7 | 3.3 ふりかえり + 完了報告書 |

> v0.1 / v0.2 / v0.3 と同じく前倒し継続実施の可能性あり。実績で 1〜2 日に圧縮できる見込み（IT-7 単独 7.00 SP/h を踏まえると **約 0.7h で完了**見込み）。

---

## 設計

### キーボード操作の網羅検証パターン

```typescript
// tests/e2e/keyboard.spec.ts のパターン
const PAGES = ["/", "/works/", "/skills/", "/books/", "/contact/"] as const;

for (const url of PAGES) {
  test(`${url} で Tab により全インタラクティブ要素にフォーカスできる`, async ({ page }) => {
    await page.goto(url);
    const interactive = page.locator(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const count = await interactive.count();
    expect(count).toBeGreaterThan(0);

    // Body から開始して、Tab で全ての要素を順次たどる
    for (let i = 0; i < count; i++) {
      await page.keyboard.press("Tab");
    }
    // 最後の要素にフォーカスがあることを確認
    const lastFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(lastFocused).toBeDefined();
  });
}
```

### フォーカストラップの実装方針

BaseLayout のハンバーガーメニュー展開時に、`#primary-navigation` 内でフォーカスがループする実装を確認 / 追加する：

```typescript
// メニュー内の最初と最後のフォーカス可能要素を取得
const focusables = nav.querySelectorAll<HTMLElement>(
  'a[href], button, [tabindex]:not([tabindex="-1"])'
);
const first = focusables[0];
const last = focusables[focusables.length - 1];

// Shift+Tab on first → last へジャンプ、Tab on last → first へジャンプ
nav.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key !== "Tab") return;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
```

### Lighthouse v1.0 予算の引き上げ

```jsonc
// apps/web/lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

### NVDA / VoiceOver 手動検証手順（ランブック化）

`docs/operation/runbooks/a11y-manual-check.md` に以下を明文化：

1. NVDA（Windows）または VoiceOver（macOS）の起動方法
2. 主要画面 5 ページの読み上げ順序確認
3. ランドマークナビゲーション（H キーで見出しジャンプ等）
4. 外部リンクの target=_blank 警告読み上げ確認
5. ダークモード時の読み上げ差異がないことを確認

### ディレクトリ構成（IT-8 追加）

```
apps/web/tests/e2e/
├── keyboard.spec.ts         # 新規（5 ページ × Tab 網羅 + スキップリンク + ランドマーク + focus-visible）
└── focus-trap.spec.ts       # 新規（ハンバーガーメニューのフォーカストラップ）

apps/web/lighthouserc.json   # 更新（v1.0 予算）

docs/operation/runbooks/
└── a11y-manual-check.md     # 新規（NVDA / VoiceOver 手動検証手順）
```

### ADR

| ADR | タイトル | ステータス |
|-----|---------|-----------|
| - | （新規 ADR は不要。既存 ADR の範囲内で実装） | - |

### ui_design.md / 既存設計ドキュメントとの整合性

整合性検証スキル（[validating-iteration-plan](../../.claude/skills/validating-iteration-plan)）の結果、IT-8 は **新規画面なし・既存仕様の検証強化のみ** のため設計ドキュメントへの反映は不要：

- フォーカストラップは [ui_design.md ヘッダー解説](../design/ui_design.md#共通レイアウト)（行 114）に既記載（「モバイル: 768px 未満でハンバーガーメニュー（48×48 px）、フォーカストラップ + Esc で閉じる」）
- `focus-visible` リング表示は [ui_design.md インタラクション設計](../design/ui_design.md#インタラクション設計)（行 449）に既記載（「キーボード Tab: フォーカス可視化（`focus-visible` リング）、論理的なタブ順序」）
- スキップリンク + ランドマークは v0.1 から `BaseLayout.astro` に実装済み

→ 本イテレーションは「既存実装をテストで担保する」位置付け。ui_design.md / architecture_frontend.md への変更は発生しない。

---

## リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Lighthouse A11y ≥ 95 が達成困難（v0.3 では 92 達成、+3 ポイント引き上げ） | 中 | axe-core で違反 0 を維持しつつ、Lighthouse の警告項目を個別対応（color-contrast / aria-label-required / heading-order 等）|
| フォーカストラップ実装で既存ハンバーガーメニュー挙動に影響 | 中 | mobile.spec.ts の既存 5 シナリオ（iPhone SE + Android Chromium）を回帰確認 |
| NVDA / VoiceOver 手動検証は環境依存（Mac / Windows） | 低 | 手順書（runbook）に「環境ごとの推奨操作」を明文化、自動化は v1.0 後の改善とする |
| キーボード操作 E2E が flaky になる（フォーカス順序がブラウザ実装依存） | 低 | `page.keyboard.press("Tab")` の auto-retry を Playwright の標準機能で吸収。失敗時はトラッキング |
| design_review レビュー指摘の漏れ（[M07 XSS / Markdown サニタイズ](../review/design_review_20260430.md) と [M08 JavaScript 無効環境 E2E](../review/design_review_20260430.md)） | 中 | **IT-8 のスコープ外**。M07 は IT-9（OGP 実装時に `set:html` の lint + サニタイズ E2E を併せて）、M08 は v1.0 リリース後の改善タスク（運用フェーズで Astro Zero JS の検証が必要になった時点で対応）と位置付ける |

---

## 完了条件

### Definition of Done

- [ ] コードレビュー完了（セルフレビュー、PR 経由）
- [ ] `npm run check` がローカルで全緑（typecheck + lint + format + vitest）
- [ ] `npm run build` 成功（19 ページ、変更なし）
- [ ] Playwright E2E 全シナリオ緑（既存 76 + keyboard 5 + focus-trap 3 = 約 84）
- [ ] axe-core で全画面 + ダークモード時の WCAG 2.1 A/AA violations 0
- [ ] Lighthouse v1.0 予算（P≥90 / SEO≥95 / A11y≥95 / BP≥95）達成
- [ ] NVDA / VoiceOver 手動検証手順書（`docs/operation/runbooks/a11y-manual-check.md`）作成
- [ ] ふりかえり（retrospective-8.md）+ 完了報告書（iteration_report-8.md）作成

### デモ項目

1. 全 6 ページ（/ / /works/ / /works/[slug]/ / /skills/ / /books/ / /contact/）で Tab により全インタラクティブ要素にフォーカスできる
2. スキップリンクが Tab で最初にフォーカスされ、Enter で `#main` へジャンプする
3. ハンバーガーメニュー展開時、Tab がメニュー内でループする（フォーカストラップ）
4. ダークモード時もキーボード操作 + axe-core violations 0 が維持される
5. main CI で Lighthouse v1.0 予算が緑になっている

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2026-05-01 | 初版作成（IT-7 / v0.3 リリース完了直後） | self |

---

## 関連ドキュメント

- [リリース計画](./release_plan.md)（v1.0 セクション）
- [IT-7 完了報告書](./iteration_report-7.md)（直前イテレーション）
- [IT-7 ふりかえり](./retrospective-7.md)（v1.0 への引き継ぎ事項）
- [v0.3 リリース完了報告書](./release_report-0_3_0.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-10）
- [UI 設計](../design/ui_design.md)（共通レイアウト + インタラクション）
- [非機能要件](../design/non_functional.md)（Lighthouse v1.0 予算）
- [テスト戦略](../design/test_strategy.md)
- [IT-8 ふりかえり](./retrospective-8.md)（実施後作成）
