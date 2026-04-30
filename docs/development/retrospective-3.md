# イテレーション 3 ふりかえり

| 項目 | 内容 |
|---|---|
| **イテレーション** | IT-3 |
| **期間** | 2026-04-30（IT-1 / IT-2 と同日に前倒し継続実施・約 2 時間で完了） |
| **計画期間** | 2026-05-11 〜 2026-05-17（1 週間） |
| **計画 SP** | 4 |
| **実績 SP** | 4（100%） |
| **計画工数** | 11h |
| **実績工数** | 約 2h（計画の 18%） |

---

## 5 つの問い

### 1. 何ができた？

- **`/robots.txt` を環境別に出力する Astro endpoint**: `apps/web/src/pages/robots.txt.ts` で `PUBLIC_ROBOTS_DISALLOW` 環境変数を見て `Allow: /` + Sitemap または `Disallow: /` を切替。クリーンビルドで両方の動作を実機確認
- **ハンバーガーメニューの実装**: 768px 未満で md:hidden トグルボタンを表示、`<script>` で開閉ロジック（`aria-expanded` / Esc キー / リンククリックで閉じる / body スクロール抑止 / メディアクエリ変更時のリセット）
- **E2E 18 シナリオ全グリーン**: モバイル用 5 シナリオ（hasTouch viewport 375x667）+ axe-core 1 シナリオを追加、合計 18 件すべて緑化
- **axe-core via Playwright で WCAG 2.1 A/AA violations 0**: `@axe-core/playwright` を導入、ホーム画面で違反 0 件
- **Cloudflare ガイドの詳細化（3 重防御）**: `heroku_staging_setup.md` の 6.5 節を「robots.txt + Cloudflare Transform Rules + MkDocs `<meta robots>` 注入」の 3 重防御に拡張、6.6 節として動作確認チェックリスト 8 項目を追加
- **MkDocs noindex 注入手順**: `docs/overrides/main.html` で `extrahead` ブロックを拡張する具体的な手順を記載
- **リリース計画再校正**: IT-1 / IT-2 実績（2.4 SP/h）を反映し、楽観 / 標準 / 悲観の 3 シナリオで v0.1〜v1.0 のリリース日見込みを再記載

### 2. 何ができなかった？

- **ハンバーガーメニューの「外側タップで閉じる」と「フォーカストラップ循環」**: 計画には含めていたが、`<dialog>` 不使用の自前実装での難易度を考慮して見送り。実用上、Esc キー閉じる + リンククリック閉じる + body スクロール抑止で v0.1 としては十分。IT-4 以降で本格化検討
- **OGP 画像の動的生成（`@astrojs/og`）**: 計画上は任意。1 ページしかないため静的画像で十分と判断、IT-4 以降で他ページ追加時に検討
- **GitHub Actions の `act` ローカル試行**: ふりかえりで挙げていた Try だが、IT-3 の実装作業に集中し未実施
- **MkDocs noindex の実機検証**: 手順は記載したが `docs/overrides/main.html` の作成と `mkdocs.yml` 編集はまだ。MkDocs ビルドを実行して `<meta robots>` の出力を確認するのは v0.1 リリース直前

### 3. 学び（Keep）

- **Astro endpoint と環境変数の組み合わせの強力さ**: `PUBLIC_*` 環境変数で SSG ビルド時の出力を切替できる。CI で staging / production 別ビルドする運用に綺麗にハマる
- **Tailwind の `md:hidden` / `md:flex` だけでハンバーガー UI が組める**: 自前 CSS は最小限（10 行未満）、JS は 50 行程度で十分なアクセシビリティを確保
- **`<script>` タグ内で TypeScript が書ける**: Astro の `<script>` ブロックは TypeScript として処理される（型注釈・型キャストが使える）。ただし strict モード下では `(toggle as HTMLButtonElement).focus()` のようなキャストが必要
- **Playwright `getByRole` は accessible name 変更に追従しない**: クリックで aria-label が変わる UI 要素では、`page.locator("#id")` の方が確実。E2E のロケータ戦略として「初期状態でユニークな id を付ける」のがメンテ容易
- **`hasTouch + viewport` で WebKit 不要のモバイル E2E**: `devices["iPhone SE"]` だと WebKit ブラウザが必要だが、viewport と hasTouch を直接設定すれば Chromium で十分
- **axe-core の導入は驚くほど簡単**: `@axe-core/playwright` を入れて `new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()` で完了。最初から導入する価値が高い

### 4. 次への改善（Try / Problem 緩和）

- **Heroku/Cloudflare 実機セットアップに着手**: コードは v0.1 完成。次は外部依存の整備
  - Heroku アカウント + Eco/Basic Dyno 課金開始
  - ドメイン取得 + Cloudflare DNS 委譲
  - GitHub Actions deploy ワークフローの `if: false` を本物の条件式に置換（`HEROKU_API_KEY` 等の secrets 設定とセット）
  - UptimeRobot で `/healthz` 監視登録
- **リリース完了報告書の作成**: `creating-release-report` スキルで v0.1 リリース完了報告書を作成（実機セットアップ後）
- **`docs/overrides/main.html` の作成 + MkDocs ビルド検証**: 実機で `<meta robots>` の出力確認
- **IT-4 で OGP 画像生成 + フォーカストラップ + 外側タップで閉じる**: ハンバーガー UI の本格化
- **ベロシティ実績 3 イテレーション分の集計**: IT-3 完了で「初回校正期」を終了。次の校正は IT-6 後（または v0.2 完了後）
- **個人ベロシティの上振れ要因分析**: 実装時間が想定の 13〜26% で完了している理由を IT-4 の見積もり時に再検証（理由が消える可能性に備える）

### 5. ベロシティ実績

| イテレーション | 計画 SP | 実績 SP | 計画工数 | 実績工数 | 達成率 |
|---|---:|---:|---:|---:|---:|
| IT-1 | 5 | 5 | 11.7h | 約 3h | 100% |
| IT-2 | 7 | 7 | 15.1h | 約 2h | 100% |
| IT-3 | 4 | 4 | 11h | 約 2h | 100% |
| **累計** | **16** | **16** | **37.8h** | **約 7h** | **100%** |

**累計実績ベロシティ**: 16 SP / 約 7h = **2.29 SP/h**

**v0.1 完成時点（コード）の総括**:

- IT-1 で 1.67 SP/h、IT-2 で 3.5 SP/h、IT-3 で 2 SP/h
- IT-3 はハンバーガー JS の試行錯誤で IT-2 より低めだが、依然として計画の 18% で完了
- 当初想定（v0.1 = 3 週間）に対して **同日完成** という大幅短縮

**v0.2 以降の見積もり**:

- 楽観: 7 SP/週（IT-1〜IT-3 ペース継続、外部依存なし）
- 標準: 5 SP/週（実装複雑度↑ + 外部連携あり）
- 悲観: 3 SP/週（停滞 / 体調不良 / 外部依存遅延）

詳細は [リリース計画](./release_plan.md) の 3 シナリオ表参照。

---

## KPT サマリ

### Keep（継続すること）

- Astro endpoint で環境別ビルド出力（PUBLIC_* 環境変数）
- Tailwind の `md:hidden` / `md:flex` でハンバーガー UI を最小コードで実装
- `<script>` 内 TypeScript（型キャストで strict mode 対応）
- Playwright のロケータは「初期状態でユニークな id」を優先
- axe-core via Playwright を最初から導入する
- 1 コミット 1 目的の粒度を IT-3 でも維持
- 実績工数を計画工数と並べて記録、ベロシティの上振れ理由を都度分析

### Problem（問題点）

- ハンバーガーの外側タップで閉じる / フォーカストラップ循環は未実装（v0.1 では割愛）
- OGP 動的生成 (`@astrojs/og`) は未着手（IT-4 以降）
- MkDocs `<meta robots>` 注入は手順のみで実機検証なし
- v0.1 リリース完了には外部依存（ドメイン取得 / Heroku 課金 / Cloudflare 委譲）が残る
- 実績ベロシティが上振れしすぎているため、IT-4 以降の見積もり精度に懸念

### Try（次に試すこと）

- v0.1 リリース完了報告書（`creating-release-report` スキル）の作成
- Heroku アカウント作成 + Eco/Basic Dyno 課金開始
- ドメイン取得 + Cloudflare DNS 委譲
- GitHub Actions deploy ワークフローの secrets 設定 + `if: false` 解除
- UptimeRobot で `/healthz` 監視登録
- IT-4 で `<dialog>` ベースのモーダルメニューに refactor 検討
- `act` による GitHub Actions ローカル試行（v0.2 開始時）

---

## 数値指標

| 指標 | 値 | 備考 |
|---|---|---|
| テストカバレッジ | 計測対象なし | サーバ層は `/healthz` のみ。Express ミドルウェアの単体テストは v0.2 以降 |
| ビルド成功率 | 100% | 1 度もビルド失敗なし（IT-1 / IT-2 で型衝突は解消済み） |
| Lighthouse Performance | ≥ 80 | v0.1 予算達成（3 runs median） |
| Lighthouse SEO | ≥ 90 | 達成 |
| Lighthouse Accessibility | ≥ 90 | 達成 |
| axe-core violations | 0 | WCAG 2.1 A/AA タグ |
| E2E 件数 | 18 件 | 全シナリオ緑（smoke 12 + mobile 5 + a11y 1） |
| E2E 実行時間 | 約 4 秒 | Chromium 単独 |
| Lighthouse CI 実行時間 | 約 30 秒 | 3 runs |
| `npm run check` 実行時間 | 約 6 秒 | typecheck + lint + format + test |
| ビルド時間（Astro） | 約 0.7 秒 | 2 page（index.html + robots.txt）+ sitemap |
| 累計コミット数（IT-1〜IT-3） | 18+ | feat / fix / docs / chore / test を網羅 |

---

## 関連ドキュメント

- [IT-3 計画](./iteration_plan-3.md)
- [IT-2 ふりかえり](./retrospective-2.md)
- [IT-3 完了報告書](./iteration_report-3.md)
- [リリース計画](./release_plan.md)（3 シナリオ再校正済み）
- [Heroku staging 環境セットアップ手順書](../operation/heroku_staging_setup.md)（Cloudflare 6.5/6.6 節を詳細化）
- [ユーザーストーリー](../requirements/user_story.md)
- [非機能要件](../design/non_functional.md)
- [運用要件](../design/operation.md)

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2026-04-30 | 初版作成（IT-3 完了直後） | self |
