# イテレーション 7 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-7 |
| **期間** | 2026-05-01（IT-6 完了直後・同日内に前倒し継続実施・約 1 時間で完了） |
| **計画期間** | 2026-05-25 〜 2026-05-31（1 週間） |
| **計画 SP** | 7 |
| **実績 SP** | 7（100%） |
| **計画工数** | 13.5h |
| **実績工数** | 約 1h（計画の 7.4%） |

---

## 5 つの問い

### 1. 何ができた？

- **/contact/ 画面の新規実装**: ui_design.md S05 順序準拠で稼働可否（ステータス + 案件規模）→ 問い合わせ案内（返信目標）→ 連絡チャネル 4 種を配置。各リンク 44×44 px 以上で WCAG 2.5.5 タッチターゲット要件を達成、aria-label でスクリーンリーダー対応。
- **モバイル E2E の 2 デバイス対応**: iPhone SE（375×667）+ Android Chromium（412×915）で既存テスト 4 種 + AC-08-3 タッチターゲット検証 2 件 / デバイスを実行。AC-08-5 ホームスクロール量検証も追加。
- **ui_design.md の整合化**: 画面一覧テーブルに `S06 Books` 追加 + ナビ記述に `Books` 追加 + 画面遷移図に `S06_Books` の state と他画面遷移を追加 + `S04_Skills ↔ S03_WorkDetail`（IT-6 約束）を反映。
- **`.gitattributes` 拡張**: 全テキストファイルに `text=auto eol=lf` を適用、Web プロジェクト主要拡張子に明示的な eol=lf を指定、バイナリ拡張子に binary 指定。pre-commit hook と併用して Windows ローカルでの format:check 衝突を恒久解消。
- **v0.3 リリース実行**: develop → main PR（#23）作成、CI 全緑（E2E 1m9s）、main マージ（c0bde49）、main CI で Lighthouse v0.3 予算（P≥85 / SEO≥95 / A11y≥92 / BP≥92）達成（1m0s）、v0.3.0 タグ付与。

### 2. 何ができなかった？

- **Card.astro 共通化の判断**: タスク 3.3 で計画したが、現状「home Featured（hardcode）/ /works/（カードグリッド）/ /skills/（メタ情報付きカード）/ /books/（軸タグ付きカード）」の 4 箇所はそれぞれ表示要素が異なり、共通化の効果が薄い。**見送りを判断**して v0.3 リリース完了の retrospective に記録（実装は v1.0 で home 再設計時に再評価）。
- **Lighthouse CI のローカルスポット実行**: タスク 3.4 で main CI に依存。pre-commit hook + .gitattributes で品質ゲートが堅牢になったため、ローカル実行の優先度は下がった。
- **Email アドレスの本番値置換**: `mailto:contact@example.com` のプレースホルダのまま。本物の連絡先を運用時に差し替える必要あり（リスク表で明示）。

### 3. 学んだこと

- **Playwright `test.use` で baseURL を明示する必要がある場合**: `forEach` 内 `test.describe` で `test.use({ viewport, hasTouch })` を呼ぶと、project 設定（`devices["Desktop Chrome"]`）と global use の継承順で baseURL が消えるケースがあった（"Cannot navigate to invalid URL"）。`test.use` 内に `baseURL` を明示することで解消。Playwright のドキュメントには直接の記載がないが、forEach + test.describe の入れ子で発生する仕様らしい。
- **GitHub `gh issue create --milestone` は open Milestone のみ検索**: closed milestone を指定すると "not found" エラー。回避策として、Issue 作成前に Milestone を一時的に open に戻し、作成後に close し直す。または `gh api` 経由で number 指定。
- **pre-commit hook の威力**: husky + lint-staged 導入後、commit 時に prettier + eslint --fix が自動適用されるため、IT-7 の 7 コミットで一度も CI 失敗なし。`.gitattributes` と組み合わせて「ローカル整形 + git の改行コード正規化」の二重防御が効いている。
- **小さい修正でも `npm run check` をローカルで回す習慣**: format / lint / typecheck / test を 1 コマンドで通せるが、Windows での format:check 環境問題があった期間は習慣化を阻害していた。pre-commit + .gitattributes 解決後は安心して `npm run check` を回せる。

### 4. 次への改善

- **v1.0 計画の作成**: IT-8（US-10 A11y 強化 / 5 SP）+ IT-9（US-11 Tech Notes + US-12 OGP / 5 SP）で v1.0 リリース。残 10 SP / 2 イテレーション。
- **ホーム再設計時の Card.astro 共通化**: v1.0 home 再設計タスクで「Featured Works を Content Collection 連動」+「カード共通化」を同時実施。
- **GitHub Project の段階的拡張**: 最小同期（Milestone + Closed 8 件）から、IT-7 で v0.3 完了 6 件追加 + Open（v1.0 残）3 件への拡張を検討。
- **Email アドレスの本番値置換**: 独自ドメイン取得 + Cloudflare DNS 委譲タスクと併せて、運用フェーズで対応。

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 実績工数 | 単独ベロシティ |
|---|---:|---:|---:|---|
| IT-1 | 5 | 5 | 約 3h | 1.67 SP/h |
| IT-2 | 7 | 7 | 約 2h | 3.50 SP/h |
| IT-3 | 4 | 4 | 約 2h | 2.00 SP/h |
| IT-4 | 7 | 7 | 約 1.5h | 4.67 SP/h |
| IT-5 | 6 | 6 | 約 2h | 3.00 SP/h |
| IT-6 | 7 | 7 | 約 1.5h | 4.67 SP/h |
| IT-7 | 7 | 7 | 約 1h | **7.00 SP/h** |
| **累計** | **43** | **43** | **約 13h** | **3.31 SP/h** |

> IT-7 は IT-1〜IT-6 のすべてのピークを塗り替える 7.00 SP/h。理由: (1) Contact 画面が小規模かつ ui_design 仕様に厳密準拠で迷いがなかった、(2) モバイル E2E は既存パターン拡張のみ、(3) ui_design 反映は機械的な追記、(4) pre-commit hook で品質ゲートが堅牢になり手戻りが消えた、(5) v0.3 リリースは v0.2 と同じパターンで実行可能。

---

## KPT

### Keep（継続すること）

- **設計ドキュメント先行 → 実装** の流れ（IT-1〜IT-7 通して効果的）
- **整合性検証スキル（validating-iteration-plan）の利用**: IT-7 でも軽微 3 件を検出（ui_design.md 4 件の更新項目）。連続 3 イテレーションで計 7 件の不整合を発見・解消。
- **pre-commit hook（husky + lint-staged）の運用**: IT-7 期間中に CI 失敗ゼロ。コミット時の自動整形が効いている。
- **`.gitattributes` の明示拡張**: バイナリと改行コードを git 側で正規化することで、Windows ローカル開発の安定性が大幅向上。
- **`#id` ベースの locator + `addInitScript` を避けて `browser.newContext`**: IT-6 ふりかえりの Try をそのまま IT-7 にも適用。
- **テスト環境差の吸収（Playwright `test.use` での baseURL 明示）**: forEach + describe の組み合わせで baseURL が消える問題への対処パターンを学んだ。

### Problem（問題点）

- **Card 共通化の判断が遅延**: 実装条件が満たされたか判断する前にリファクタタスクを計画に入れてしまった。次回からは「Rule of Three が成立する具体的なパターン」が明確に見える時のみリファクタタスクを入れる。
- **Email プレースホルダのまま** : 本物の連絡先を持っていない状態で実装したため、本番リリース時に置換忘れリスクがある。`docs/operation/runbooks/` に「Email 置換」の項目を追加する案。
- **Lighthouse v0.3 予算の確認が main マージ後**: v0.2 / v0.3 とも main マージ後に Lighthouse を回す運用。万が一予算未達時のロールバック手順は別途整備が必要。

### Try（次に試すこと）

- **v1.0 計画の作成**: IT-7 完了直後に IT-8 計画を作成する。
- **GitHub Project の v0.3 完了 Issue 化**: US-05 / US-06 / US-08 を Closed Issue として追加起票し、Milestone v0.3 を close する（最小同期 → 段階拡張）。
- **Email 連絡先の運用ガイド化**: `docs/operation/runbooks/email-update.md` を作成し、本番リリース時の置換手順を明文化する。
- **`/contact/` の Plausible / 簡易解析イベント**: Contact CTA クリック率の計測（v1.0 / non_functional.md の計測指標と整合）。

---

## 数値指標

| 指標 | 値 |
|---|---|
| 計画 SP / 実績 SP | 7 / 7（100%） |
| 計画工数 / 実績工数 | 13.5h / 約 1h（7.4%） |
| 実績ベロシティ | 7.00 SP/h（IT-7 単独・全イテレーション中ピーク） |
| 累計ベロシティ（IT-1〜IT-7） | 43 SP / 約 13h = 3.31 SP/h |
| Vitest テスト数 | 2 passed / 0 failed（変更なし） |
| Playwright E2E シナリオ数 | 76 passed / 0 failed（IT-6 後の追加で 62 → +14: contact 5 + a11y 2 + mobile +7） |
| axe-core violations | 0（/ + /works/ + /works/[slug]/ + /skills/ + /books/ + /contact/、ライト + ダーク） |
| Astro check errors | 0 |
| ESLint errors | 0（warnings 5 件: server.js 2 + books 1 + skills 2 / max-lines 系） |
| Prettier 違反 | 0（pre-commit hook で自動整形） |
| ビルド時間 | 約 1.4 秒（`npm run build`、19 ページ生成） |
| Lighthouse v0.3 予算 | ✅ 達成（P≥85 / SEO≥95 / A11y≥92 / BP≥92、main CI 1m0s） |
| ビルド出力ページ数 | 19（/、/works/ + 11 件、/skills/、/books/、/contact/、/404） |
| 連絡チャネル数 | 4（Email / GitHub / LinkedIn / X） |

---

## 関連ドキュメント

- [IT-7 計画](./iteration_plan-7.md)
- [IT-6 ふりかえり](./retrospective-6.md)
- [IT-6 完了報告書](./iteration_report-6.md)
- [v0.2 リリース完了報告書](./release_report-0_2_0.md)
- [v0.3 リリース完了報告書](./release_report-0_3_0.md)（本書と同時作成）
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-05 / US-06 / US-08）
- [UI 設計](../design/ui_design.md)（S05 / S06 Books 追加 + 画面遷移図 IT-7 反映済み）

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-05-01 | 初版作成（IT-7 完了直後・v0.3.0 リリース完了直後） | self |
