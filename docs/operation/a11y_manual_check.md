# アクセシビリティ手動検証手順

## 目的

axe-core の自動検証では拾いきれない **読み上げ順序 / ランドマークナビゲーション / ライブリージョン** などをスクリーンリーダーで実際に検証する。リリース前と四半期に 1 回の運用で実施する。

US-10 / IT-8 で導入。Lighthouse v1.0 予算（A11y ≥ 95）と axe-core violations 0 を補完する位置付け。

## 対象ツール

| プラットフォーム | スクリーンリーダー | 入手 |
|---|---|---|
| Windows | **NVDA**（無料） | <https://www.nvaccess.org/download/> |
| macOS | **VoiceOver**（OS 標準） | `Cmd + F5` で起動 |
| Linux | Orca（GNOME 標準） | `sudo apt install orca` |
| iOS / Android | VoiceOver / TalkBack（モバイル検証は v1.0 後） | OS 標準設定 |

## 検証対象ページ

| # | URL | 確認ポイント |
|---|---|---|
| 1 | `/` | プロフィール（h1）+ Featured Works + Skills Highlights + 主要 CTA |
| 2 | `/works/` | h1「Works」+ 件数表示 + 技術タグフィルタ + Work カード |
| 3 | `/works/sample-1/` | パンくず + h1 タイトル + 4 ブロック構造 + 外部リンク |
| 4 | `/skills/` | h1「Skills」+ 凡例 + 4 カテゴリ + 関連 Work 逆参照 |
| 5 | `/books/` | h1「Books」+ 軸別 / カテゴリ別の内訳 + フィルタ + 全件テーブル |
| 6 | `/contact/` | h1「Contact」+ 稼働可否 + 連絡チャネル 4 種 |

## 検証項目（共通）

| ID | 項目 | 期待動作 |
|---|---|---|
| MA-1 | スキップリンク | Tab で最初に「メインコンテンツへ移動」が読み上げられ、Enter で `<main>` に飛ぶ |
| MA-2 | ランドマーク | NVDA: `D` キー / VoiceOver: ローター → ランドマーク で header / nav / main / footer をジャンプできる |
| MA-3 | 見出しナビゲーション | NVDA: `H` キー / VoiceOver: ローター → 見出し で h1 → h2 → h3 が論理順で読み上げられる |
| MA-4 | 外部リンク警告 | `target=_blank` のリンクで「外部サイトへ移動」相当の追加読み上げがある（aria-label の補足） |
| MA-5 | フォーカス可視化 | `:focus-visible` で青リングが描画される（VoiceOver カーソル と スクリーンリーダーカーソルの差を意識） |
| MA-6 | ハンバーガーメニュー（モバイル） | 768px 未満で `aria-expanded` の状態が読み上げられ、Esc で閉じる |
| MA-7 | ダークモードトグル | `aria-pressed` の状態（true / false）が読み上げられる |
| MA-8 | 連絡チャネル | `aria-label`（「メールで連絡する（メールクライアントが起動します）」等）が日本語で読み上げられる |
| MA-9 | フィルタ操作 | Works / Books でタグ / 軸 / カテゴリの `aria-pressed` 状態が読み上げられる |

## 手順

### NVDA（Windows）

1. NVDA を起動（`Ctrl + Alt + N`）
2. ブラウザで対象 URL を開く
3. `Ctrl + Home` でページ先頭にフォーカス
4. `Tab` を押してスキップリンク（MA-1）を確認
5. `H` キーで見出しを順次たどる（MA-3）
6. `D` キーでランドマークを順次たどる（MA-2）
7. `Insert + F7` で要素一覧を開き、リンク数 / 見出し数を確認
8. モバイル幅にウィンドウを縮小し、ハンバーガーメニュー（MA-6）を確認
9. ダークモードトグルをクリックして `aria-pressed` の読み上げを確認（MA-7）

### VoiceOver（macOS）

1. `Cmd + F5` で VoiceOver 起動
2. ブラウザで対象 URL を開く
3. `Ctrl + Option + U` でローターを開き、ランドマーク / 見出し / リンクを切替
4. `Ctrl + Option + Right Arrow` で要素を順次たどる
5. NVDA と同じく MA-1 〜 MA-9 を確認

### 結果記録

各リリース前に以下を `docs/operation/a11y_manual_check_<バージョン>.md` のような形で残す（任意）：

```markdown
# A11y 手動検証結果（v1.0 リリース前）

検証日: YYYY-MM-DD
検証者: self
ツール: NVDA 2024.4 / Chromium 128

| URL | MA-1 | MA-2 | MA-3 | MA-4 | MA-5 | MA-6 | MA-7 | MA-8 | MA-9 | 備考 |
|---|---|---|---|---|---|---|---|---|---|---|
| / | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ | - | - | |
| /works/ | ✅ | ✅ | ✅ | - | ✅ | - | ✅ | - | ✅ | |
| /contact/ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ | ✅ | - | |
```

## 失敗時の対処

| 失敗 | 対処 |
|---|---|
| 見出し順序が論理的でない（h2 → h4 のスキップ等） | 該当ページの見出しレベルを見直す。`max-lines` 警告との兼ね合いで関数分割と同時に調整 |
| ランドマークが認識されない | `<main id="main">` などの id / role 属性を確認、BaseLayout に欠落がないか |
| ハンバーガーメニューの状態読み上げが弱い | `aria-expanded` + `aria-controls` の整合、aria-label の動的更新を確認 |
| 外部リンクが警告なしで開かれる印象 | `aria-label` で「外部サイトへ移動」相当の文言を追加（既存 Contact チャネル参照） |

## 関連ドキュメント

- [UI 設計](../design/ui_design.md)（共通レイアウト + インタラクション設計）
- [非機能要件](../design/non_functional.md)（アクセシビリティ目標）
- [テスト戦略](../design/test_strategy.md)（axe-core / Playwright 自動検証）
- [IT-8 計画](../development/iteration_plan-8.md)（US-10）
- [IT-8 完了報告書](../development/iteration_report-8.md)（実施後作成）
