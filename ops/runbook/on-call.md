# On-Call 初動チェックリスト

## 概要

UptimeRobot や Pushover からアラートを受け取った直後の 15 分間に実施するチェックリストです。

> **本書のステータス**: スケルトン（IT-2 で配置）。最初の数回のアラート対応経験で具体化します。

## 受信時にやること（最初の 5 分）

### 1. アラート内容を確認

| ソース | 確認先 |
|---|---|
| UptimeRobot | メール / Pushover の通知本文（HTTP ステータス、応答時間） |
| Heroku Metrics（メール） | アラート種別（Memory / Response time / Error rate） |
| GitHub Actions | 失敗ジョブの URL（CI 退化） |

### 2. 自分の状況を判定

| 状況 | 対応 |
|---|---|
| 業務時間内（平日 9-18 時） | 30 分以内に着手 |
| 業務時間外 | best effort（採用面接前後の場合は最優先） |
| 旅行中・ネットワーク不可 | 受領のみ、復帰後に対応 |

### 3. 直前のアクションを思い出す

- 直近の deploy / promote はいつか？
- 直近の Config Vars / DNS 変更は？
- 当日に採用面接 / 重要な訪問予定はあるか？

## 切り分け（次の 10 分）

### 4. 状況確認コマンド

```bash
# Heroku 状態
heroku ps -a portfolio-prod
heroku logs --tail -a portfolio-prod | head -100

# 直近リリース
heroku releases -a portfolio-prod | head -5

# /healthz から見た外部観測
curl -fsS https://portfolio.example.com/healthz
curl -I https://portfolio.example.com/

# Heroku 全体障害
curl -s https://status.heroku.com/api/v4/current-status | jq '.status[]?'
```

### 5. SEV レベル判定

| 観測内容 | SEV レベル | 推奨 runbook |
|---|---|---|
| サイト全停止、5xx 100% | SEV-1 | [rollback.md](./rollback.md) → ダメなら [hotfix.md](./hotfix.md) → さらにダメなら [disaster-recovery.md](./disaster-recovery.md) |
| 特定ルートのみ 500 | SEV-2 | [hotfix.md](./hotfix.md) |
| 性能劣化のみ（応答 < 5s） | SEV-2/3 | 翌営業日に PR 化 |
| Lighthouse 退化 | SEV-3 | 通常 PR、次のスプリントで対応 |
| 一時的な 429 / 503 | 観察 | 5 分後に再確認、継続するなら SEV-2 へ |

### 6. アクション選択

```text
SEV-1 → rollback / hotfix / disaster-recovery
SEV-2 → hotfix or 翌営業日対応
SEV-3 → GitHub Issue 起票、後追い対応
誤検知 → アラート閾値を見直し（しきい値変更は ADR or Issue で記録）
```

## アラート対応後（30 分以内）

### 7. ログ・メモを残す

- 検知時刻、初動時刻、復旧時刻
- 直接原因の仮説
- 取った行動

これらは Postmortem の素材になる。

### 8. SEV-1 / SEV-2 は Postmortem 必須

`ops/runbook/postmortem/YYYY-MM-DD-<slug>.md` を作成（テンプレートは [運用要件 - Postmortem](../../docs/design/operation.md#postmortem) 参照）。

## アラート疲れの予防

### 誤検知が多い場合

| 症状 | 対処 |
|---|---|
| Eco Dyno のスリープで `/healthz` がたまに失敗 | UptimeRobot のリトライを 2 回に、staging は監視間隔 10 分 |
| 短時間の応答時間スパイク | しきい値を 5 分継続条件に |
| Cloudflare の一時的 5xx | 5 回連続失敗で初めてアラート |

### 月次レビュー

毎月の運用棚卸し時に：

- アラート発火回数 / 誤検知率
- 平均対応時間
- Postmortem 件数

を眺め、しきい値・通知先を調整する。

## チェックリスト（コピペ用）

```text
- [ ] アラート受信時刻: HH:MM
- [ ] 状況: 業務時間 / 業務時間外
- [ ] 直前のアクション: <none|deploy|config|...>
- [ ] heroku ps 確認
- [ ] heroku logs 確認
- [ ] 外部 /healthz 確認
- [ ] Heroku Status 確認
- [ ] SEV レベル判定: SEV-?
- [ ] 取った行動: rollback / hotfix / DR / 観察 / 誤検知
- [ ] 復旧時刻: HH:MM
- [ ] Postmortem 必要: yes / no
```

## 関連

- [rollback.md](./rollback.md)
- [hotfix.md](./hotfix.md)
- [disaster-recovery.md](./disaster-recovery.md)
- [postmortem/](./postmortem/)
- [運用要件 - 連絡体制](../../docs/design/operation.md#連絡体制)
