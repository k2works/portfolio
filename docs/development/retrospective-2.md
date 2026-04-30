# イテレーション 2 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-2 |
| **期間** | 2026-04-30（IT-1 と同日に前倒し継続実施・約 2 時間で完了） |
| **計画期間** | 2026-05-04 〜 2026-05-10（1 週間） |
| **計画 SP** | 7 |
| **実績 SP** | 7（100%） |
| **計画工数** | 15.1h |
| **実績工数** | 約 2h（計画の 13%） |

---

## 5 つの問い

### 1. 何ができた？

- **`exactOptionalPropertyTypes: true` + `noUncheckedIndexedAccess: true` の再有効化**: IT-1 で緩和した型厳格性を取り戻し、`playwright.config.ts` を条件付きスプレッドで対応。Astro / Vite / Playwright 周辺の型問題は局所的な対処（`@ts-expect-error` 1 行）のみで解決
- **Tailwind 4 の全面適用**: `tailwind.config.ts` 新規 + `global.css` の `@import "tailwindcss"` + BaseLayout / index.astro の `<style scoped>` を全削除して Tailwind クラスへ移行。`max-w-prose` レイアウト、sticky ヘッダー、`focus-visible:` リング、`prefers-color-scheme` ベースのダークトークン
- **runbook 6 本のスケルトン作成**: hotfix / disaster-recovery / on-call / secret-rotation / domain-renewal / pre-interview-freeze。既存 3 本と合わせて運用 runbook 9 本（postmortem ディレクトリは別）が完成
- **GitHub Actions CI/CD 整備**: 5 ジョブの CI（lint-test / build / e2e / lighthouse / security）+ deploy ワークフロー（secrets 未設定で `if: false` ガード）+ Dependabot（グルーピング付き）+ PR テンプレート + `.gitleaks.toml`
- **E2E 12 シナリオ実装・全グリーン**: Playwright Chromium インストール、E01 ホーム表示 / ナビ A11y / OGP のシナリオを 12 件実装、2.5 秒で完走
- **Lighthouse CI ローカル実行成功**: v0.1 予算（Performance ≥ 80 / SEO ≥ 90 / A11y ≥ 90）を満たすことを確認、レポートを Cloud Storage に upload
- **コミット粒度の徹底**: 6 コミットに意味の単位で分割（fix / feat / docs / chore / test / docs）

### 2. 何ができなかった？

- **axe-core via Playwright の導入**: `tasks/4` の任意項目で、IT-2 では時間配分の都合で見送り。IT-3 で v1.0 の WCAG 2.1 AA 厳格化と一緒に導入予定
- **GitHub Actions の実 Heroku 連携**: secrets（`HEROKU_API_KEY` / `HEROKU_APP_STAGING` 等）が未設定のため `if: false` でスキップ。実際の連携は v0.1 リリース時の Heroku アカウント作成と同時に有効化
- **Cloudflare 前段配置の実機セットアップ**: 設計と手順書（`heroku_staging_setup.md`）は揃っているが、実 DNS の設定はドメイン取得とセットなので IT-3 / v0.1 リリース直前に実施
- **ハンバーガーメニュー（モバイルナビ）**: 768px 未満は flex-wrap で縦積みになるが、ハンバーガー化はしていない。IT-3 で実装予定

### 3. 学び（Keep）

- **段階的厳格化の有効性**: IT-1 で `exactOptionalPropertyTypes` を一旦緩和し、IT-2 で再有効化する 2 段階アプローチが機能。最初から厳格にせず「動くものを作ってから締める」順で実装の心理的負荷が下がった
- **条件付きスプレッドの威力**: `webServer: undefined` を渡せない問題に対し、`...(condition ? { webServer: ... } : {})` で undefined 自体を排除する書き方が有効。Astro / Vite / Playwright の TypeScript 設定に共通する対処パターン
- **CI ワークフローの「if: false」ガード**: secrets 未設定でも YAML を main に置けるパターン。リリース直前に `if:` を本物の条件式に切り替えるだけで有効化できる。「TODO コメントで有効化手順を記載」する運用も次のオーナーへの引継ぎに有効
- **Tailwind v4 + Astro v5 の組み合わせは安定**: `@import "tailwindcss"` + `@tailwindcss/vite` プラグインで設定 1 行（`@ts-expect-error` 1 行）。クラスは期待通り動作、ビルドも 0.7 秒で完走
- **E2E スナップショットなしでも価値**: ビジュアル差分テストを使わなくても、`getByRole` + `data-testid` ベースの 12 シナリオで「Featured Works 3 件 / aria-current / 外部リンク `target=_blank` + `rel`」など重要な不変条件は守れる

### 4. 次への改善（Try / Problem 緩和）

- **axe-core via Playwright を IT-3 で導入**: `@axe-core/playwright` をインストールし、E2E に `axe.run()` を追加。violations 0 を予算化
- **ハンバーガーメニューの実装**: モバイル（< 768px）でナビをトグル化、フォーカストラップ + Esc 閉じる + body スクロール抑止
- **Cloudflare 前段配置の文書化**: `heroku_staging_setup.md` を「実機セットアップガイド」へ昇格、設定スクリーンショットを残す
- **GitHub Actions の手元検証**: `act`（GitHub Actions のローカル実行ツール）で CI ジョブをローカル試行する選択肢を検討。ただし Heroku 関連は実 secrets が必要なため限界あり
- **`if: false` の自動化**: リリーススクリプトで `if: false` を検索 → 警告するチェックを追加し、有効化忘れを防ぐ
- **ベロシティ再校正**: IT-2 完了で実績 2.4 SP/h（IT-1 単独 1.67 → IT-2 単独 ~3.5）。手動構築・既存設計ドキュメント豊富という条件下では生産性が高い。IT-3 のベロシティを 8-10 SP/週へ仮上方修正、ただし IT-3 の作業（実機 Heroku セットアップ等）は外部依存があり遅延しうる

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 計画工数 | 実績工数 | 達成率 |
|---|---:|---:|---:|---:|---:|
| IT-1 | 5 | 5 | 11.7h | 約 3h | 100% |
| IT-2 | 7 | 7 | 15.1h | 約 2h | 100% |
| **累計** | **12** | **12** | **26.8h** | **約 5h** | **100%** |

**累計実績ベロシティ**: 12 SP / 約 5h = **2.4 SP/h**

**IT-3 仮再見積もり**:

- 残 v0.1 = 4 SP（US-09 + US-01 仕上げ + 横断 A11y）
- IT-3 想定: 4 SP / 約 2h（実装系）+ 0.5h（実機 Heroku セットアップは外部依存）
- v0.1 リリースまでの累計工数想定: 約 8h
- 当初想定（v0.1 = 3 週間）に対して **大幅に短縮可能**（楽観シナリオで 4-5 日に圧縮）

ただし以下は外部依存で遅延しうる：

- Heroku アカウント作成 + Eco Dyno 課金開始（数十分〜1 時間）
- ドメイン取得・DNS 設定（取得時間 + 伝播 5 分〜数時間）
- Cloudflare アカウント作成 + DNS 委譲（伝播最長 24 時間）

これらは **「コードの完成」≠「公開可能」** という区別を IT-3 / リリース計画で明示する。

---

## KPT サマリ

### Keep（継続すること）

- 段階的厳格化（IT-1 緩和 → IT-2 再有効化）
- 条件付きスプレッドで undefined を渡さない型対応
- `if: false` ガード + TODO コメントで CI に置く有効化前のワークフロー
- Tailwind v4 + Astro v5 の `@import` ベース統合
- E2E は `getByRole` + `data-testid` 主体、ビジュアル差分は最小限
- 1 コミット 1 目的（IT-2 の 6 コミットすべて）
- 5 つの問い + KPT + 数値指標のふりかえりフォーマット

### Problem（問題点）

- axe-core を IT-3 に押し出した（任意とはいえ A11y の検証深さは下がる）
- GitHub Actions の deploy ワークフローが `if: false` で実走していない
- Cloudflare 前段配置がまだ実機検証されていない
- ベロシティの上昇は「設計が豊富 + 手動構築 + Codex 不使用」という IT-1 / IT-2 特有条件によるもので、IT-3 で外部連携が増えると下振れる可能性
- リリース計画の v0.1 = 3 週間という見立てが大幅にずれている。再校正タイミング

### Try（次に試すこと）

- IT-3 で axe-core via Playwright 導入
- IT-3 でハンバーガーメニュー実装
- IT-3 で Cloudflare 設定の実機セットアップガイド化
- IT-3 完了 = v0.1 リリース準備完了として、Heroku アカウント作成 + デプロイの実機リハーサル
- リリース計画を IT-3 完了時点で再校正（v0.2 / v0.3 / v1.0 の到達日も実績ベース）
- `act` による GitHub Actions ローカル実行を試行
- IT-3 完了報告書の後に v0.1 リリース完了報告書（`creating-release-report` スキル）を作成

---

## 数値指標

| 指標 | 値 | 備考 |
|---|---|---|
| テストカバレッジ | 計測対象なし | サーバ層ロジックは `/healthz` のみ。Express ミドルウェアの単体テストは IT-3 で追加検討 |
| ビルド成功率 | 100%（最終） | 初回は `exactOptionalPropertyTypes` 有効化で playwright.config.ts が型エラー、条件付きスプレッドで解消 |
| 検出欠陥 | 0 件（リリース後欠陥はなし、未公開のため） | - |
| Lighthouse スコア | v0.1 予算（80/90/90）クリア | numberOfRuns: 3 の median で全 assertion が PASS |
| `npm run check` 実行時間 | 約 6 秒 | typecheck（最遅）+ lint + format + test |
| ビルド時間（Astro） | 約 0.7 秒 | 1 page、未変動 |
| E2E 実行時間 | 2.5 秒 | 12 シナリオ並列、Chromium のみ |
| Lighthouse CI 実行時間 | 約 30 秒 | 3 runs、ローカル `astro preview` 起動含む |
| Slug サイズ予測 | < 50 MB | 変動なし |
| 累計コミット数（IT-1 + IT-2） | 12 | feat / fix / docs / chore / test の各種別を網羅 |

---

## 関連ドキュメント

- [IT-2 計画](./iteration_plan-2.md)
- [IT-1 ふりかえり](./retrospective-1.md)
- [IT-2 完了報告書](./iteration_report-2.md)
- [リリース計画](./release_plan.md)
- [ユーザーストーリー](../requirements/user_story.md)
- [非機能要件](../design/non_functional.md)
- [運用要件](../design/operation.md)

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-04-30 | 初版作成（IT-2 完了直後） | self |
