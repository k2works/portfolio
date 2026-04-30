# Disaster Recovery（Heroku 全停止時の GitHub Pages 退避）

## 概要

Heroku が広域障害で長時間（30 分以上）応答しない場合に、Cloudflare の DNS を GitHub Pages のミラーへ切り替えてサイト稼働を維持する手順です。

> **本書のステータス**: スケルトン（IT-2 で配置）。年次 DR 訓練（机上 + Pages 生存確認）で具体的な手順を磨き込みます。

## 適用基準

| 状況 | 適用 |
|---|:---:|
| Heroku Status で広域障害が宣言 | ✅ |
| `heroku ps -a portfolio-prod` が 30 分以上応答しない | ✅ |
| `/healthz` が 30 分以上 5xx | ✅ |
| 単一 Dyno クラッシュ（再起動で復旧見込み） | ✗（rollback.md / hotfix.md） |

## 前提条件

- Cloudflare DNS が portfolio.example.com を管理している（[ADR-0004](../../docs/adr/0004-cloudflare-front-cdn.md)）
- GitHub Pages に常時ミラーを配置している（IT-3 で整備予定 / `.github/workflows/mirror-pages.yml`）
- DNS の TTL を 300 秒に設定している（即時切替前提）

## 手順

### 1. 状況確認

```bash
# Heroku 全体障害の確認
curl -s https://status.heroku.com/api/v4/current-status | jq '.status[]?'

# 自アプリの状態
heroku ps -a portfolio-prod
heroku logs --tail -a portfolio-prod
```

[Heroku Status](https://status.heroku.com/) で広域障害が宣言されているか確認。

### 2. ステークホルダー通知（任意）

採用面接が当日に控えている場合は、ステータスページ（v1.0 で整備）または採用担当者に状況連絡。

### 3. Cloudflare DNS で Pages へ切替

```text
Cloudflare ダッシュボード
└─ DNS タブ
   └─ portfolio.example.com の CNAME を Heroku から GitHub Pages に変更
      - 旧: <random>.herokudns.com
      - 新: <github-username>.github.io
   └─ Proxy を ON のまま保存
```

GitHub Pages 側のカスタムドメインも設定済みであること（リポジトリ Settings → Pages）。

### 4. Cloudflare キャッシュパージ

DNS 切替後、エッジキャッシュは旧オリジンの内容を保持している可能性があるため：

```text
Cloudflare ダッシュボード
└─ Caching タブ
   └─ Configuration → Purge Cache → Purge Everything
```

### 5. 切替確認

```bash
# DNS が伝播したか
dig portfolio.example.com +short

# Pages 経由で配信されているか
curl -I https://portfolio.example.com/
# Server: GitHub.com など Pages 由来のヘッダ
```

### 6. Heroku 復旧後の切戻し

Heroku Status で「resolved」が宣言されたら：

```bash
# Heroku の生存確認
curl -fsS https://portfolio-prod.herokuapp.com/healthz

# Cloudflare DNS を Heroku に戻す
# CNAME: <github-username>.github.io → <random>.herokudns.com

# キャッシュパージ
```

### 7. Postmortem 起票

`ops/runbook/postmortem/YYYY-MM-DD-heroku-outage.md` を作成。

## 制約

- **GitHub Pages のミラー**は IT-3 で整備するため、本手順は v1.0 リリース後から有効
- それまでの代替: 静的 `dist/` を任意の無料ホスティング（Cloudflare Pages 直接デプロイ等）に手動アップロード
- DNS 伝播は最長 5 分（TTL 300 秒）。これより速い切替は Cloudflare レベルでは難しい

## 年次 DR 訓練

| 項目 | 頻度 | 内容 |
|---|---|---|
| GitHub Pages ミラーの生存確認 | 年次 | `https://<github-username>.github.io/` が応答することを目視 |
| 机上シミュレーション | 年次 | 本書の手順を読み返し、不明点を解消 |
| 実際の DNS 切替リハーサル | 任意 | staging のサブドメインで実演（任意・コストとリスクを見て） |

## チェックリスト

- [ ] Heroku Status を確認
- [ ] 広域障害なら本手順、単一障害なら rollback / hotfix
- [ ] Cloudflare DNS で CNAME を Pages に変更
- [ ] Cloudflare キャッシュパージ
- [ ] DNS 伝播 + Pages 経由配信を確認
- [ ] 復旧後に Heroku に切戻し
- [ ] Postmortem 起票

## 関連

- [hotfix.md](./hotfix.md)
- [rollback.md](./rollback.md)
- [ADR-0004: Cloudflare 無料プランを前段に配置](../../docs/adr/0004-cloudflare-front-cdn.md)
- [Heroku Status](https://status.heroku.com/)
