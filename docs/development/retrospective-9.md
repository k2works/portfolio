# イテレーション 9 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-9 |
| **期間** | 2026-05-01（IT-8 完了直後・同日内に前倒し継続実施・約 1 時間で完了 / v1.0.0 リリース） |
| **計画期間** | 2026-06-08 〜 2026-06-14（1 週間） |
| **計画 SP** | 5 |
| **実績 SP** | 5（100%） |
| **計画工数** | 10.6h |
| **実績工数** | 約 1.0h（計画の 9.4%） |

---

## 5 つの問い

### 1. 何ができた？

- **Tech Notes ホスト分離型への方針確定 + 実装（US-11）**: 当初は MkDocs を Astro と同居（`/docs/`）させる想定だったが、Astro ビルドのリードタイム短縮と保守性の観点から **MkDocs を GitHub Pages へ独立配信**（[ADR-0007](../adr/0007-mkdocs-independent-delivery.md) 既出）に方針変更。Astro 側ヘッダーは「Tech Notes ↗」（外部遷移インジケータ）+ MkDocs 側は `docs/overrides/main.html` で「これは個人の学習・設計メモです」のガイダンスバナー + 「← ポートフォリオに戻る」戻り動線 + `noindex` を一括注入。AC-11-1〜5 を全て達成。
- **OGP 完備（US-12）**: `apps/web/public/og.svg`（1200×630）を配置し、`BaseLayout.astro` で全画面の `og:image` / `og:type` / `og:title` / `og:description` / `twitter:card=summary_large_image` を出力。Works 詳細では `og:title = "Work タイトル｜期間"` の動的化を達成。当初検討した `@astrojs/og` 動的 PNG 生成は採用せず、SVG 静的配信で必要十分（ビルド時間 1.5 秒台を維持）と判断。
- **Lighthouse v1.0 最終予算を全達成**: `lighthouserc.json` を P≥0.90 / SEO≥0.95 / A11y≥0.95 / BP≥0.95 に引き上げ、main CI で **Perf 1.00 / SEO 1.00 / A11y 1.00 / BP 0.96** を達成。
- **ヒーロー再設計（ALU 公式コマ埋め込み + キャッチコピー刷新）**: 計画外の磨き込みとして、`/`（ホーム）のヒーロー領域に **ALU 公式の埋め込みコマ（ベルセルク）** を iframe で配置し、ポートフォリオの差別化キャッチを成立。第三者 iframe を axe-core から exclude する設計判断と、smoke E2E の外部リンク検査の誤検出を回避するセレクタ修正を併せて実施。
- **Contact X 一本化 + フッター LinkedIn 削除**: 連絡チャネルを Email / GitHub / X (@k2works) の 3 種に集約。フッターからも LinkedIn を削除し、運用負荷の小さい連絡導線へ整理。`apps/web/src/data/contact.ts` 更新 + `contact.spec.ts` 改修。
- **v1.0.0 main マージ + タグ + リリース完了報告書**: PR #27 → `6d5135f` マージ → `v1.0.0` タグ付与 → `release_report-1_0_0.md` 作成、までを同日内で完了。

### 2. 何ができなかった？

- **NVDA / VoiceOver 手動検証の実施**: runbook（`docs/operation/a11y_manual_check.md`）整備済だが、実環境（Windows / macOS）での実検証は v1.0 リリース直後の運用フェーズに持ち越し。本イテレーションでは「自動 axe-core で違反 0」+「Lighthouse A11y 1.00」までを達成範囲とした。
- **GitHub Milestone v1.0 の Close + 残ストーリーの Issue 化**: タスク 3.5 で計画したが、Milestone 操作は本書作成と並列で運用フェーズで実施する想定。
- **production アプリ作成 + Pipeline 解除**: v0.3 リリース完了報告書から継続している外部依存タスク。独自ドメイン取得 + Heroku Custom Domain と併せて運用フェーズへ持ち越し。

### 3. 学んだこと

- **OGP は SVG 静的配信で十分なケースが多い**: `@astrojs/og` の動的 PNG 生成（案 A）と自前 OG（案 B）を比較したが、**ホーム / Works 一覧 / Skills / Books / Contact の 5 種は共通画像で十分**であり、Works 詳細のみ `og:title` を動的化（テキスト差し替え）すれば AC を満たせる。1200×630 SVG をビルド時に生成 → 静的配信、で Twitter / Slack / Discord すべての OGP プレビューが正しく表示された。複雑な依存追加を回避できた。
- **第三者 iframe を axe-core から exclude する設計判断**: ALU 公式コマの埋め込み iframe をそのまま axe-core が走査すると、外部コンテンツ起因の violations を検出してしまう。`axe.analyze({ exclude: ['iframe'] })` 相当の exclude 設定を `a11y.spec.ts` に追加して回避。**自社制御外のコンテンツは a11y 自動検証から除外する** という運用ルールを確立できた。
- **Astro Dev Toolbar の shadow DOM 干渉**: ローカル `npm run dev` で Astro Dev Toolbar が `<header>` 要素を shadow DOM 内に挿入するため、smoke E2E の `page.locator('header').first()` が誤検出していた。**実 DOM 直下の `<header>` のみを取得するセレクタ**（`page.locator('body > header')` 相当）に修正することで解消。Playwright のセレクタは shadow DOM を意識する必要があると学んだ。
- **MkDocs ホスト分離型の利点**: Astro 同居型より GitHub Pages 独立配信の方が、(1) Astro ビルドが純粋になる、(2) MkDocs Material のテーマカスタマイズが自由、(3) 採用ページ（Astro）と学習メモ（MkDocs）の評価対象を明確に分離できる、というメリットが運用してみてはっきりわかった。[ADR-0007](../adr/0007-mkdocs-independent-delivery.md) の判断は正しかった。

### 4. 次への改善

- **リリース直前のローカル Lighthouse 検証ではポート占有確認をルーチン化**: ローカル検証中に Playwright dev server がバックグラウンド常駐して誤った計測（Perf 0.84）になった事故を踏まえ、計測前に必ず `lsof -i:4321` 相当でポート占有を確認し、必要なら kill する運用にする。
- **Playwright dev server を E2E 終了時に kill するスクリプト**: `scripts/kill-dev-server.mjs` 等を追加し、`npm run test:e2e` 終了時に占有プロセスを必ず解放するようにする（v1.0 運用フェーズで検討）。
- **第三者埋め込みコンポーネント追加時の axe-core exclude チェックリスト**: `docs/operation/a11y_manual_check.md` に「iframe / object / embed 等の埋め込みは axe-core から exclude する」のチェック項目を追記し、今後の埋め込み追加時に手戻りを防ぐ。
- **NVDA / VoiceOver 手動検証の実施**: v1.0 リリース直後の運用フェーズで runbook MA-1〜9 を実行し、結果を `docs/operation/a11y_manual_check_v1_0.md` に記録する。

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
| IT-9 | 5 | 5 | 約 1.0h | 5.00 SP/h |
| **累計** | **53** | **53** | **約 14.5h** | **3.66 SP/h** |

> IT-9 は IT-8 ピーク 10.00 SP/h からは下振れ（5.00 SP/h）。要因は (1) Tech Notes ホスト分離型へ方針変更を伴う追加実装、(2) Astro Dev Toolbar の shadow DOM 干渉によるテスト改修、(3) ヒーロー再設計（ALU 公式コマ埋め込み）+ Contact X 一本化 + LinkedIn 削除という計画外の磨き込みを v1.0 リリース時に同梱した。それでも累計時間単位ベロシティは 3.66 SP/h と過去平均（3.56 SP/h）を上回り、**v1.0 全 5 リリース（v0.1 / v0.2 / v0.3 / v1.0-α / v1.0）を 53 SP / 約 14.5h で完了**。

---

## KPT

### Keep（継続すること）

- **ALU 公式埋め込みでベルセルクのコマを使った差別化キャッチ採用**: 採用・営業向けポートフォリオで「技術的卓越性 + 個人の物語性」を両立させる印象的なヒーローが完成。第三者 iframe の正規利用パターンとして再利用可。
- **Lighthouse v1.0 を全カテゴリ達成（Perf 1.00 / SEO 1.00 / A11y 1.00 / BP 0.96）**: v0.1 0.8/0.9/0.9/0.9 → v1.0 0.90/0.95/0.95/0.95 への段階引き上げが計画通り機能。
- **Tech Notes ホスト分離で MkDocs Material を生かしながら採用ページの品質を維持**: [ADR-0007](../adr/0007-mkdocs-independent-delivery.md) の判断が正解だったことを実装で確認。
- **第三者 iframe を axe-core から exclude する設計判断**: 自社制御外コンテンツの a11y 評価責務を明確化。
- **整合性検証スキル（validating-iteration-plan）の利用**: IT-6〜IT-9 の 4 連続で計 10 件の不整合を計画作成直後に発見・解消。
- **pre-commit hook + .gitattributes の運用**: IT-7〜IT-9 期間中に CI 失敗ゼロを継続。
- **設計ドキュメント先行 → 実装** の流れ（IT-1〜IT-9 通して効果的）。

### Problem（問題点）

- **ローカル Lighthouse 検証で Playwright dev server が常駐していて誤った計測（Perf 0.84）になった事象**: ポート 4321 が占有されたまま LHCI を実行してしまい、初回計測値が予算未達と誤判定。原因特定までに時間を消費。
- **Astro Dev Toolbar の shadow DOM 内 `<header>` が smoke E2E の外部リンク検査を誤検出させた**: `page.locator('header').first()` が shadow DOM 内の Toolbar header にマッチしてしまい、想定外のリンク（Astro 公式 docs 等）を「外部リンク」と誤検出。
- **iframe 仕様変更で a11y / smoke / contact 周りのテスト改修が連鎖的に必要だった**: ALU 公式コマ埋め込み 1 機能の追加で、E2E 4 ファイル（a11y / smoke / contact / 新設の seo）の改修が必要になり、影響範囲を読み切れていなかった。
- **NVDA / VoiceOver 手動検証は環境依存で実施タイミングが難しい**: IT-8 から継続して未消化。実検証履歴が残らない期間が続いている。

### Try（次に試すこと）

- **リリース直前のローカル Lighthouse は必ずポート占有確認をルーチン化**: `lsof -i:4321` / `netstat -ano | findstr 4321` を計測前に実行する手順を `docs/operation/runbooks/lighthouse-local.md`（新設案）に明文化。
- **Playwright dev server を E2E 終了時に kill するスクリプトを scripts/ に追加検討**: `scripts/kill-dev-server.mjs` で `playwright test` 終了時に占有プロセスを解放する仕組みを v1.0 運用フェーズで実装。
- **第三者埋め込みコンポーネント追加時の axe-core exclude チェックリストを `docs/operation/a11y_manual_check.md` に追記**: iframe / object / embed / video.src の埋め込み追加時の a11y 評価責務切り分けルールを明文化。
- **v1.0 リリース直後に NVDA / VoiceOver 手動検証を実施**: runbook の MA-1〜9 を全 6 ページで実行し、結果を `docs/operation/a11y_manual_check_v1_0.md` に記録。
- **Card.astro 共通化の判断を v1.0 リリース後に再評価**: home Featured / /works/ 一覧 / /skills/ 関連 Work / /books/ の 4 箇所のカード構造を比較。
- **Plausible / Cloudflare Web Analytics で Contact CTA クリック率計測**: v1.0 リリース後の本番運用で Contact 一本化（X）の効果を測定。

---

## 数値指標

| 指標 | 値 |
|---|---|
| 計画 SP / 実績 SP | 5 / 5（100%） |
| 計画工数 / 実績工数 | 10.6h / 約 1.0h（9.4%） |
| 実績ベロシティ | 5.00 SP/h（IT-9 単独） |
| 累計ベロシティ（IT-1〜IT-9） | 53 SP / 約 14.5h = 3.66 SP/h |
| Vitest テスト数 | 2 passed / 0 failed（変更なし） |
| Playwright E2E スイート数 | smoke / mobile / a11y / works / works-detail / skills / theme / books / contact / keyboard / focus-trap / **tech-notes（新規）** / **seo（新規）** = 13 スイート全緑 |
| axe-core violations | 0（全画面 + ダークモード時で WCAG 2.1 A/AA、ALU 公式 iframe は exclude） |
| Astro check errors | 0（`@ts-expect-error` 1 件のみ） |
| ESLint errors | 0（warnings 6 件: max-lines 系のみ） |
| Prettier 違反 | 0（pre-commit hook で自動整形） |
| ビルド時間 | 約 1.5 秒（`npm run build`、19 ページ生成 + OGP は `public/og.svg` 静的配信） |
| Lighthouse v1.0 最終予算（CI 実測）| **Perf 1.00 / SEO 1.00 / A11y 1.00 / BP 0.96**（予算 P≥0.90 / SEO≥0.95 / A11y≥0.95 / BP≥0.95 全達成） |
| ビルド出力ページ数 | 19（変更なし）+ `public/og.svg` |
| OGP 対応画面数 | 全画面（ホーム / Works 一覧 / Works 詳細 / Skills / Books / Contact / 404） |
| 連絡チャネル数 | 3（Email / GitHub / X、LinkedIn 削除）|
| v0.3.0..v1.0.0 コミット数 | 12（merges 除く）= feat 6 + docs 6 |

---

## 関連ドキュメント

- [IT-9 計画](./iteration_plan-9.md)
- [IT-9 完了報告書](./iteration_report-9.md)
- [IT-8 ふりかえり](./retrospective-8.md)
- [IT-8 完了報告書](./iteration_report-8.md)
- [v1.0 リリース完了報告書](./release_report-1_0_0.md)（本書と同時作成）
- [v0.3 リリース完了報告書](./release_report-0_3_0.md)
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)（US-11 / US-12）
- [UI 設計](../design/ui_design.md)（S91 Tech Notes / OGP 指針）
- [非機能要件](../design/non_functional.md)（Lighthouse v1.0 予算）
- [ADR-0003 MkDocs 共存戦略](../adr/0003-mkdocs-coexistence-strategy.md)
- [ADR-0007 MkDocs を GitHub Pages へ独立配信](../adr/0007-mkdocs-independent-delivery.md)
- [アクセシビリティ手動検証手順](../operation/a11y_manual_check.md)

---

## 次のステップ

| アクションアイテム | 担当 | 優先度 | 期限 |
|---|---|---|---|
| NVDA / VoiceOver 手動検証の実施（runbook MA-1〜9）| self | 中 | v1.0 リリース直後 |
| `scripts/kill-dev-server.mjs` の追加 | self | 中 | 運用フェーズ |
| `docs/operation/runbooks/lighthouse-local.md` 新設 | self | 低 | 運用フェーズ |
| `docs/operation/a11y_manual_check.md` に iframe exclude チェックリスト追記 | self | 中 | 運用フェーズ |
| 独自ドメイン取得 + Cloudflare DNS 委譲 + Heroku Custom Domain | self | 中 | 運用フェーズ |
| production アプリ作成 + Pipeline + `promote-to-production` 解除 | self | 中 | 運用フェーズ |
| Card.astro 共通化判断（home Featured / /works/ / /skills/ / /books/ の 4 箇所比較）| self | 低 | 運用フェーズ |
| Plausible / Cloudflare Web Analytics で Contact CTA クリック率計測 | self | 低 | 運用フェーズ |
| Firefox / Safari / Edge の Playwright 自動化 | self | 低 | 運用フェーズ |
| GitHub Milestone v1.0 を Close + 残ストーリー Issue 化 | self | 中 | 運用フェーズ |

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-05-01 | 初版作成（IT-9 完了直後・v1.0.0 リリース完了直後） | self |
