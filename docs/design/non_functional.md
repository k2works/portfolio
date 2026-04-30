# 非機能要件

## 概要

採用・営業向けの個人ポートフォリオサイト（Astro SSG + MkDocs を Heroku 単一 Dyno で配信）に対する非機能要件を、ISO/IEC 25010 の品質特性に沿って定義する。

設計方針：

- **個人サイト規模に最適化**: エンタープライズ級の SLA（99.99% 等）は採用しない。コストと運用負荷のバランスを優先
- **数値で定義**: 「速い」「安全」ではなく、計測可能な値で定義する
- **計測手段とセット**: 各要件には CI / 運用監視のどちらで計測するかを明記する
- **既存設計との整合**: アーキテクチャ・テスト戦略・技術スタックで定義した数値を SLA/SLO として正式化する

## 品質属性の優先度

| 品質属性 | 優先度 | 根拠 |
|---|:---:|---|
| 性能効率性 | 高 | 採用担当者の検索流入で離脱率に直結。Lighthouse スコアが採用判断にも影響する想定 |
| 使用性（A11y 含む） | 高 | 多様な訪問者を想定、WCAG 2.1 AA は採用先からも問われやすい |
| セキュリティ | 中 | 公開静的サイトのため資産リスクは低いが、HTTPS / ヘッダ / シークレット管理は厳格に |
| 信頼性（可用性） | 中 | 個人サイトのため 99.5% で十分、ただし採用面接前後の停止は避ける |
| 保守性 | 高 | 個人運用、長期低頻度メンテのため、観察可能性と単純さを優先 |
| 互換性（ブラウザ） | 中 | モダンブラウザのみ対応、レガシー IE は除外 |
| 移植性 | 低 | Heroku ロックインを許容（[ADR-0002](../adr/0002-hosting-heroku.md)） |

## 性能要件

### レスポンスタイム

| 項目 | 目標 | 計測点 | 失敗時 |
|---|---|---|---|
| TTFB（production） | p50 < 200ms / p95 < 500ms / p99 < 1000ms | Lighthouse CI / Heroku Metrics | Lighthouse CI で警告 |
| LCP（production） | p50 < 2.0s / p95 < 2.5s | Lighthouse CI（モバイル設定） | CI 失敗 |
| FCP | p95 < 1.5s | Lighthouse CI | 警告 |
| TBT | p95 < 200ms | Lighthouse CI | 警告 |
| CLS | < 0.05 | Lighthouse CI | 警告 |
| INP | < 200ms | Lighthouse CI（モバイル） | 警告 |
| `/healthz` 応答時間 | p95 < 50ms | UptimeRobot / Heroku Metrics | UptimeRobot からアラート |

**除外条件**:

- Heroku Eco Dyno のコールドスタート時（staging のみ。production は Basic Dyno でスリープなしのため対象）

### スループットと同時接続

ポートフォリオサイトは小規模アクセス想定だが、SNS で言及された場合のスパイクは考慮する。

| 項目 | 目標 |
|---|---|
| 通常時 | 1 req/s（86,400 req/day 相当） |
| ピーク時（バースト） | 50 req/s を 5 分間維持 |
| 同時接続数 | 200（Heroku Basic Dyno の `web_concurrency = 1` で Express の Keep-Alive 接続上限を確保） |
| 帯域 | < 10 GB/月（Heroku Common Runtime のソフトリミット内） |

ピーク超過時は `503 Service Unavailable` を返し、Heroku Auto-Scaling は採用しない（個人サイト）。Cloudflare 前段配置で吸収するのは将来課題（[インフラストラクチャアーキテクチャの拡張シナリオ](./architecture_infrastructure.md)）。

### バンドルサイズ予算

| 項目 | 目標 | 計測 |
|---|---|---|
| 初期 HTML（gzip） | < 15 KB | Lighthouse CI |
| 初期 JS（gzip） | < 30 KB | Lighthouse CI |
| 初期 CSS（gzip） | < 30 KB | Lighthouse CI |
| 画像（LCP 候補） | < 200 KB（AVIF/WebP 優先） | `astro:assets` |
| Web フォント | 2 ウェイトまで、woff2 で各 < 30 KB | ビルド検証 |

## 使用性要件

### アクセシビリティ

| 項目 | 目標 | 計測 |
|---|---|---|
| WCAG | 2.1 AA 準拠 | Lighthouse Accessibility ≥ 95 |
| キーボード操作 | 全機能をマウスなしで操作可能 | E2E（Playwright） |
| カラーコントラスト | 本文 4.5:1、大文字 3:1 | Lighthouse / 手動 |
| スクリーンリーダー | NVDA / VoiceOver で主要画面が読み上げ可能 | 手動検証（リリース前） |
| `aria-current` | ナビゲーションで現在地を示す | E2E |
| フォーカス可視化 | `:focus-visible` で全インタラクティブ要素にリング表示 | 手動 / E2E |

### レスポンシブ・対応ブラウザ

| 項目 | 目標 |
|---|---|
| モバイル | iPhone SE（375px）以上 |
| タブレット | 768px 以上 |
| デスクトップ | 1024px 以上 |
| 対応ブラウザ | 直近 2 メジャー版の Chrome / Firefox / Safari / Edge（market share 95% 以上） |
| IE | 非対応（明示） |

### コンテンツ品質

| 項目 | 目標 |
|---|---|
| ページ目的の明示 | 全ページで `<h1>` が 1 個、ページタイトルがブラウザタブで識別可能 |
| 多言語対応 | 日本語のみ（v1）、英語版は将来の v2 |
| 読み込み時の体感 | LCP までに「内容のあるもの」が表示される（背景色プレースホルダで遷移を滑らかに） |

## セキュリティ要件

### 認証・認可

| 環境 | 認証 | 認可 |
|---|---|---|
| production | なし（公開サイト） | なし |
| staging | Basic 認証 | 単一の運用ユーザー |

### 通信セキュリティ

| 項目 | 仕様 |
|---|---|
| TLS | TLS 1.2 以上、Heroku ACM で自動更新 |
| HSTS | `max-age=31536000; includeSubDomains; preload` |
| HTTP→HTTPS | 301 リダイレクトを Express で実装 |
| Cookie | 本サイトでは未使用（将来導入時は `Secure; HttpOnly; SameSite=Lax`） |

### セキュリティヘッダ（helmet で設定）

| ヘッダ | 値 |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | 上記 HSTS と同じ |

### 入力検証・出力エスケープ

| 項目 | 方針 |
|---|---|
| 入力 | フォーム入力なし（v1）。将来コンタクトフォーム追加時は Zod でサーバ側検証 |
| 出力 | Astro はデフォルトで HTML エスケープ。`set:html` の使用は禁止（lint で検出） |
| Markdown | 信頼可能な著者のみが記述、`html` の埋め込みは sanitize-html を通す |

### シークレット管理

| 項目 | 仕様 |
|---|---|
| 保管 | Heroku Config Vars / GitHub Encrypted Secrets |
| ローカル | `.env`（Git 管理外）、共有は `.env.vault`（dotenv-vault） |
| ローテーション | 90 日ごと（`HEROKU_API_KEY` 等） |
| コミット混入検出 | gitleaks を CI で実行、push 時に検証 |
| 公開リポジトリ | 公開設定だが、シークレット類は `.gitignore` と `.env.example` で代替 |

### 監査ログ

| 項目 | 内容 | 保持 |
|---|---|---|
| アクセスログ | morgan「combined」形式、IP / UA / URL / status / 応答時間 | Papertrail 7 日 |
| 個人情報 | 記録しない（メール本文・氏名等） | - |
| Heroku 操作ログ | Heroku Audit（無料枠で 1 年） | 1 年 |
| GitHub 操作ログ | GitHub Audit Log（個人プランで 90 日） | 90 日 |

### 法令・コンプライアンス

| 項目 | 対応 |
|---|---|
| GDPR / 改正個人情報保護法 | クッキー利用なし、IP は短期保管のみ。Cookie バナーは不要 |
| 著作権 | 自作以外の画像・素材は使用しない、または明示的にクレジット |
| 第三者ライセンス | OSS ライセンス遵守、`THIRD_PARTY_LICENSES.md` を本番ビルドに含める |

## 信頼性（可用性）要件

### SLA / SLO

| 環境 | SLA / SLO | 月間ダウンタイム許容 |
|---|---|---|
| production | 月間稼働率 99.5%（SLO） | 約 3.6 時間 |
| staging | 99% を目安、SLO なし | - |

99.9% 以上を目指さない理由：

- Heroku Common Runtime 自体の SLA は 99.95% 程度だが、CDN 前段なし・単一リージョンのため上限が見える
- 個人サイトのため 99.9% を達成するコストに見合う価値がない（無料 CDN 導入時に再評価）

### 障害復旧目標

| 指標 | 目標 |
|---|---|
| 障害検知時間 | 5 分以内（UptimeRobot 5 分間隔） |
| 初期対応着手 | 30 分以内（業務時間外は best effort） |
| 復旧時間（RTO） | 1 時間以内（直前の Slug にロールバック） |
| データ復旧（RPO） | 0（永続データなし、コードは GitHub） |

### 障害許容性

| シナリオ | 対応 |
|---|---|
| Dyno クラッシュ | Heroku Router が自動再起動。Express の `process.on('uncaughtException')` でログ出力後プロセス終了 |
| Heroku Region 障害 | 受容（個人サイトの SLO 範囲）。長時間障害時は GitHub Pages へ一時退避手順を runbook に記載 |
| ビルド失敗 | デプロイをブロックし直前の Slug を維持（Heroku Pipeline 標準動作） |
| 外部画像 / フォント CDN 障害 | 自サイト配信のため非該当 |
| DDoS | Heroku 標準対策のみ。激化時は Cloudflare 前段配置を緊急投入 |

## 保守性要件

### ログ

| 項目 | 仕様 |
|---|---|
| 出力先 | stdout / stderr（Heroku Logplex 経由で Papertrail へ） |
| フォーマット | morgan「combined」（アクセスログ）+ JSON 構造化（アプリケーションログ） |
| ログレベル | `LOG_LEVEL` で制御（production: info / staging: debug） |
| 機微情報 | 出力しない（個人情報・シークレット・トークン） |
| 保持期間 | Papertrail 7 日（無料枠） |
| 検索性 | Papertrail のキーワード検索で 7 日分を即時検索可能 |

### 監視項目と閾値

| カテゴリ | 項目 | 閾値 | 通知 |
|---|---|---|---|
| 死活 | UptimeRobot `/healthz` | 連続 2 回失敗 | メール（5 分以内） |
| 性能 | p95 レスポンス時間 | 1.5s 超過 5 分継続 | UptimeRobot or Heroku Metrics |
| エラー率 | 5xx 比率 | 5% 超過 5 分継続 | Heroku Metrics |
| Dyno 負荷 | メモリ使用率 | 80% 超過 5 分継続 | Heroku Metrics |
| Lighthouse | Performance / SEO / A11y | < 90 / 95 / 95 | CI 失敗（main） |
| 証明書 | Heroku ACM | 自動更新 | 失敗時 Heroku から通知 |
| ドメイン | カスタムドメイン名前解決 | 失敗 | UptimeRobot |

### アラート設計

| 重要度 | 通知方法 | 対応時間 |
|---|---|---|
| 緊急（サイト停止） | メール + 携帯通知（Pushover 等） | 30 分以内 |
| 警告（性能劣化） | メール | 翌営業日 |
| 情報（CI 失敗） | GitHub の通知 | 業務時間内 |

### コード品質

| 項目 | 目標 | 計測 |
|---|---|---|
| TypeScript エラー | 0 | CI ゲート |
| ESLint エラー | 0 | CI ゲート |
| Prettier 違反 | 0 | CI ゲート |
| markdownlint | 0 | CI ゲート |
| Cyclomatic Complexity | 関数あたり < 10 | ESLint `complexity` |
| ファイル長 | < 300 行 | ESLint `max-lines` |
| 関数長 | < 50 行 | ESLint `max-lines-per-function` |
| 重複コード | < 3% | 任意（jscpd 等。導入時に追加） |

### ドキュメント

| 項目 | 目標 |
|---|---|
| README | 開発手順 / デプロイ手順 / トラブルシュート |
| ADR | 重要な技術的意思決定はすべて ADR 化（[docs/adr/](../adr/)） |
| ランブック | `ops/runbook/` に障害対応手順、復旧手順、Heroku 緊急時引継ぎを置く |
| 更新頻度 | コード変更時に同時更新、PR レビューで見落としを検知 |

## 拡張性要件

### 垂直スケーリング

| 段階 | Dyno タイプ | 想定アクセス |
|---|---|---|
| 初期（v1） | Basic（512MB / 1 CPU） | 通常時 1 req/s |
| 中期 | Standard-1X（512MB / Heroku 加重 1） | 5 req/s |
| 後期 | Standard-2X（1GB） | 20 req/s |

垂直スケーリングは Heroku ダッシュボードまたは `heroku ps:resize` で即時切替。

### 水平スケーリング

| 段階 | Dyno 数 | 構成変更 |
|---|---|---|
| v1 | 1 | 不要 |
| v2（必要時） | 2〜3 | Express をステートレス維持、セッション・キャッシュは持たない |
| v3（必要時） | 4 以上 | Cloudflare 前段配置で CDN 化、ロードバランス補強 |

水平スケーリング前提で、サーバ側に状態を持たない設計を維持する（ファイル書き込み禁止、メモリキャッシュは TTL 付き）。

### 機能拡張シナリオ

| シナリオ | 影響 / 対応 |
|---|---|
| コンタクトフォーム | Express にエンドポイント追加、SendGrid Add-on 導入 |
| 訪問者数の動的表示 | Heroku Postgres Mini 導入、レイヤード 3 層へ昇格（[バックエンド参照](./architecture_backend.md)） |
| ブログ | Astro Content Collections に `posts` を追加、RSS / Atom 生成（`@astrojs/rss`） |
| 多言語化 | Astro i18n、URL に `/en/` を追加、`hreflang` で SEO 担保 |
| Headless CMS 連携 | microCMS / Contentful からビルド時にフェッチ |
| 検索 | Pagefind を SSG ビルドに組み込み（クライアント完結） |
| ダッシュボード（管理） | アーキテクチャ再評価、ヘキサゴナルへ移行を ADR 化 |

## トレードオフと意思決定

| トレードオフ | 採用 | 理由 |
|---|---|---|
| 高 SLA（99.9%）vs コスト | 99.5% を採用 | 個人サイトに過剰投資しない |
| マルチリージョン vs 単一リージョン | 単一（Heroku Common Runtime） | コスト > レイテンシ改善のメリット |
| 完全 IaC vs 段階的 IaC | 段階的（手動構築 → Terraform） | 初期速度重視、安定後にコード化 |
| 認証あり vs なし | なし（公開） | コンテンツが公開前提のため不要 |
| Cookie バナー必要 vs 不要 | 不要 | クッキーを設定しないため法的義務なし |
| ダークモード対応 vs 単一テーマ | 対応 | 採用担当者の閲覧環境多様性に配慮、コストも軽微 |

## 計測と継続的改善

### 測定の自動化

| 種類 | ツール | 頻度 |
|---|---|---|
| 性能（合成監視） | Lighthouse CI（GitHub Actions） | PR ごと、main マージごと |
| 性能（実ユーザー） | （任意）web-vitals + Plausible / Cloudflare Web Analytics | 常時 |
| 死活 | UptimeRobot | 5 分間隔 |
| セキュリティヘッダ | Mozilla Observatory（手動） | リリースごと |
| 依存性脆弱性 | Dependabot / `npm audit` | 週次 |
| アクセシビリティ | axe-core via Playwright | PR ごと |

### 改善トリガー

| 指標 | しきい値 | アクション |
|---|---|---|
| Performance スコア | < 90 を 1 週間継続 | 直近変更を ロールバック / 最適化タスクを起票 |
| 月間ダウンタイム | > 3.6 時間 | Postmortem を `ops/runbook/postmortem/` に記録 |
| Lighthouse A11y | < 95 | リリース停止、修正後再リリース |
| アラート誤報率 | > 20% | しきい値・通知先の調整 |

## 関連ドキュメント

- [バックエンドアーキテクチャ](./architecture_backend.md)
- [フロントエンドアーキテクチャ](./architecture_frontend.md)
- [インフラストラクチャアーキテクチャ](./architecture_infrastructure.md)
- [テスト戦略](./test_strategy.md)
- [技術スタック](./tech_stack.md)
- [非機能要件定義ガイド](../reference/非機能要件定義ガイド.md)
- [ADR-0002: ホスティングプラットフォームに Heroku を採用](../adr/0002-hosting-heroku.md)
