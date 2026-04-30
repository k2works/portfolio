# ADR-0004: Cloudflare 無料プランを初期構成から前段に配置する

Heroku 単一リージョン（US/EU）の制約を補い、日本からの LCP p95 < 2.5s と SLO 99.5% を確保するため、Cloudflare 無料プランを初期構成から DNS / CDN として前段配置する。

日付: 2026-04-30

## ステータス

2026-04-30 承認

## コンテキスト

- ヒアリング 4 でホスティング先として Heroku を採用した（[ADR-0002](./0002-hosting-heroku.md)）。
- 設計レビュー（[2026-04-30](../review/design_review_20260430.md)）で次の問題が指摘された：
  - **Architect**: Heroku Common Runtime は US/EU のみ。日本想定なら米国 → 日本の RTT は 100〜150ms、TLS 確立込みで TTFB 400ms 超は珍しくない。CDN 前段なしで LCP p95 < 2.5s を達成するのは厳しい。
  - **Architect**: CDN 前段なしの Heroku 単一 Dyno では、巡回 bot の影響で Eco Dyno が休まらず計測時にキャッシュ未温の不利が生じる。
  - **User Representative**: 採用面接当日に Heroku 障害が発生した場合の保険が薄い。

検討した選択肢：

| 選択肢 | 月額 | 効果 | 採用 |
|---|---|---|---|
| A. CDN なし（現状） | $0 | LCP リスク高、SLO 達成困難 | ✗ |
| B. **Cloudflare Free（DNS + CDN + DDoS 緩和）** | $0 | 全エッジから配信、DDoS 緩和、TLS 終端、`/docs/` キャッシュも有効 | ✓ |
| C. AWS CloudFront | $1〜 | 細やかな制御、Lambda@Edge | コスト・運用負荷で却下 |
| D. Vercel / Netlify CDN（前段だけ） | $0〜 | 機能は十分だが、Heroku オリジン構成は非標準 | 構成複雑化で却下 |

## 決定

**Cloudflare Free プランを初期構成から前段に配置する。**

具体的な構成：

1. **DNS 移管**: ドメイン（`portfolio.example.com`）の名前解決を Cloudflare に委譲。`A`/`CNAME` レコードを Heroku の DNS Target に向ける。
2. **CDN プロキシ**: Cloudflare のオレンジクラウドを ON にし、エッジキャッシュ・WAF・DDoS 緩和を有効化。
3. **TLS 終端**: Cloudflare の Universal SSL（無料）で TLS 1.2/1.3 を終端。Heroku 側の Automated Certificate Management は無効化（オリジン側は Cloudflare の Authenticated Origin Pulls で保護）。
4. **キャッシュルール**:
   - `/assets/*`（Astro ビルド成果物）: `Cache-Control: public, max-age=31536000, immutable`、エッジキャッシュ 1 年
   - HTML: エッジキャッシュ 5 分（更新の即時反映を担保しつつ、バースト負荷を吸収）
   - `/healthz`: キャッシュなし
5. **Page Rules / Cache Rules**: Cloudflare Free 枠の 3 ルール内で上記を実装。
6. **Always Online**: オリジン障害時に Cloudflare のキャッシュから配信を継続（採用面接前後の停止リスクを軽減）。
7. **DNS TTL**: 300 秒に設定し、Heroku → GitHub Pages 等への切替を 5 分以内に伝播させる。

## 影響

### 良い影響

- 日本からの TTFB / LCP が大幅に改善（エッジから配信されるため RTT が短縮）。
- Heroku Eco Dyno のスリープ・コールドスタート影響を HTML 5 分キャッシュで緩和。
- DDoS / WAF 基本対策が無料で得られる。
- Always Online により採用面接当日のオリジン障害リスクを軽減。
- `/docs/` の MkDocs 成果物にも CDN キャッシュが適用され、配信負荷が下がる。

### 悪い影響・リスク

- DNS の管理ポイントが 1 箇所増える（レジストラと Cloudflare の二段構成）。
- Cloudflare の障害が直接サイト停止に直結する（過去事例あり）。
- HTML 5 分キャッシュにより、デプロイ後の最大 5 分はステイル配信される（許容、もしくは Cloudflare の Cache Purge を CI で叩く）。
- Cloudflare のセキュリティルール誤設定で正規アクセスがブロックされる事故が起こりうる（特に WAF）。
- `helmet` の HSTS / CSP 等のヘッダが Cloudflare 経由で正しく訪問者に届くかの検証が必要。

### コスト

| 項目 | 月額 |
|---|---|
| Cloudflare Free | $0 |
| **増分** | **$0** |

### 取り消し可能性

DNS を Cloudflare からレジストラ直の AWS Route 53 / 元の DNS に戻すだけで前段を外せる。設定変更は数分。乗り換えコストは小。

## コンプライアンス

- DNS が Cloudflare 経由であることを `dig` / `nslookup` で確認し、運用ドキュメントに記録。
- Cloudflare ダッシュボードのキャッシュルールが README または `ops/runbook/cloudflare.md` に記載されていること。
- CI に「`/healthz` が `Cache-Control: no-store` で返る」検証を追加。
- Cloudflare の WAF / Bot 対策の閾値変更は ADR の更新を伴う。
- CI で Cache Purge を実行するスクリプトを `ops/scripts/` に配置（デプロイ後の即時反映用）。

## 備考

- 著者: ポートフォリオプロジェクト（k2works/portfolio）
- 関連ドキュメント:
  - [インフラストラクチャアーキテクチャ](../design/architecture_infrastructure.md)
  - [非機能要件](../design/non_functional.md)
  - [ADR-0002: ホスティングプラットフォームに Heroku を採用](./0002-hosting-heroku.md)
  - [分析成果物レビュー（2026-04-30）](../review/design_review_20260430.md)（H04 への対応）
- 再評価のトリガー:
  - Heroku が日本リージョンを提供開始した場合
  - Cloudflare Free の 3 ルール上限が運用上の制約になった場合
  - トラフィックが月間 100K req を超え、Pro プラン（$25/月）の検討が必要になった場合
