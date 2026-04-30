# ドメイン更新手順

## 概要

`portfolio.example.com` の独自ドメインの更新、レジストラ・DNS・SSL の整合確認手順です。

> **本書のステータス**: スケルトン（IT-2 で配置）。実ドメイン取得後に具体化します。

## 関係する登録先

| 登録先 | 役割 | 確認頻度 |
|---|---|---|
| レジストラ（お名前.com / Cloudflare Registrar / Google Domains 等） | ドメイン所有権 | 自動更新を有効化、年次で支払い確認 |
| Cloudflare DNS | 名前解決 + CDN + WAF | 月次でレコード一覧を目視 |
| Heroku Custom Domain | アプリへのドメインバインド | デプロイ変更時 |
| Heroku Automated Certificate Management（ACM） | SSL/TLS 証明書 | Heroku が自動更新、失敗時のみ通知 |

## 年次更新フロー

### 1. 30 日前: 更新確認

レジストラから「ドメイン更新通知」メールが届く（自動更新有効ならクレジットカード確認のみ）。

```text
✅ 自動更新が有効
✅ 支払いカードが有効期限内
✅ レジストラのアカウントメールアドレスが現役
```

すべて ✅ なら何もしない。1 つでも ✗ なら手動更新フローへ。

### 2. 手動更新フロー

```bash
# レジストラのダッシュボードで更新を実行
# 通常 1〜3 年単位で支払い

# Whois で更新が反映されたか確認
whois portfolio.example.com | grep -i 'expir'
```

### 3. 5 日前 / 直前: 念のため監視

UptimeRobot のステータスを毎日確認。`/healthz` が 5xx になっていないか。

### 4. 更新後の検証

```bash
# 1. DNS が引けるか
dig portfolio.example.com +short

# 2. HTTPS が有効か
curl -I https://portfolio.example.com/

# 3. SSL 証明書の期限
echo | openssl s_client -connect portfolio.example.com:443 -servername portfolio.example.com 2>/dev/null \
  | openssl x509 -noout -dates
```

## DNS レコード変更時の手順

ドメインの DNS 設定を変更する場合（サブドメイン追加 / Heroku 切替 / GitHub Pages 退避等）：

### 1. 変更前のレコード状態を保管

```bash
# Cloudflare ダッシュボード → DNS → Export
# または curl で全レコード取得
curl -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN" \
  | jq > dns-backup-$(date +%Y%m%d).json
```

### 2. 変更を適用

Cloudflare ダッシュボードで実行、または API 経由。

### 3. TTL 経過待ち

DNS の TTL は 300 秒に設定されているため、最大 5 分で全世界に伝播。

### 4. 確認

```bash
dig portfolio.example.com +short
# 期待値が返ってくるまで待つ
```

## Heroku Custom Domain 変更時

```bash
# 既存ドメインの確認
heroku domains -a portfolio-prod

# ドメイン追加
heroku domains:add portfolio.example.com -a portfolio-prod

# ACM 有効化（既に有効なら不要）
heroku certs:auto:enable -a portfolio-prod

# DNS Target を確認
heroku domains -a portfolio-prod | grep DNS

# Cloudflare DNS の CNAME を Heroku の DNS Target に向ける
```

## ACM の自動更新失敗時

Heroku ACM は自動更新だが、たまに失敗する：

```bash
# 状況確認
heroku certs:auto -a portfolio-prod

# 手動再有効化
heroku certs:auto:disable -a portfolio-prod
heroku certs:auto:enable -a portfolio-prod
```

それでもダメな場合は Heroku サポートに問い合わせ（個人プランでもチャット可）。

## チェックリスト

### 年次更新

- [ ] レジストラの自動更新が有効
- [ ] レジストラの支払いカードが有効期限内
- [ ] レジストラのアカウントメールが現役
- [ ] Whois で expir 日付を確認
- [ ] 更新後に DNS / HTTPS / 証明書が有効

### DNS 変更

- [ ] 変更前のレコードをバックアップ
- [ ] Cloudflare で変更
- [ ] TTL 経過 + dig で確認
- [ ] UptimeRobot で green
- [ ] 主要ページの目視確認

## 関連

- [secret-rotation.md](./secret-rotation.md)
- [Heroku staging 環境セットアップ手順書](../../docs/operation/heroku_staging_setup.md)
- [ADR-0004: Cloudflare 無料プランを前段に配置](../../docs/adr/0004-cloudflare-front-cdn.md)
