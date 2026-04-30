# ロールバック手順

## 概要

Heroku Slug を直前のリリースに戻して 1 〜 2 分以内に復旧する手順です。

> **本書のステータス**: スケルトン（IT-1 完了時点）。実環境での検証は v0.1 リリース後の月次実演で行います。

## 判断基準

迷ったら **ロールバックを優先** してください。原因究明は staging で行います。

| 状況 | 対応 |
|---|---|
| production で SEV-1 が発生し、原因が直近デプロイと相関 | 即ロールバック |
| 5xx 比率が 5% を超え、5 分以内に解消しない | 即ロールバック |
| Lighthouse Performance が < 70 に急落 | ロールバック検討 |
| 機能不具合（404 / 表示崩れ）でも他ページに影響なし | hotfix（[hotfix.md](./hotfix.md) 未作成）で対応 |

## 手順

### 1. 直近のリリース履歴を確認

```bash
heroku releases -a portfolio-prod
```

出力例：

```text
=== portfolio-prod Releases - Current: v42
v42  Deploy 1234abc   user@example.com  2026-05-04 12:34:56 +0900
v41  Deploy 5678def   user@example.com  2026-05-04 11:00:00 +0900
v40  Deploy abcdef0   user@example.com  2026-05-03 18:30:00 +0900
```

### 2. 直前リリースに戻す

```bash
heroku rollback v41 -a portfolio-prod
```

> Heroku Pipeline 経由でデプロイした場合でも、各アプリ単位で `rollback` できます。

### 3. 復旧確認

```bash
# 1. ヘルスチェック
curl -fsS https://portfolio.example.com/healthz
# 期待値: ok

# 2. 主要ページ
curl -I https://portfolio.example.com/
curl -I https://portfolio.example.com/works/

# 3. UptimeRobot で green を確認（外部からの実観測）
```

### 4. ログ確認

```bash
heroku logs --tail -a portfolio-prod
# 5xx エラーが消えているか
```

### 5. Postmortem 起票

SEV-1 / SEV-2 の場合は `ops/runbook/postmortem/YYYY-MM-DD-<slug>.md` を作成し、以下を記録：

- 概要
- 影響範囲（時間 / 機能）
- タイムライン（検知 → 初動 → ロールバック → 復旧）
- 直接原因 / 根本原因（5 Whys）
- 再発防止策
- 学び

## staging でのリハーサル（月次）

production のロールバックは滅多に発生しないため、月次で staging に対し実演します。

```bash
heroku releases -a portfolio-staging
heroku rollback v<N> -a portfolio-staging
curl -fsS https://staging.portfolio.example.com/healthz
# その後、最新版に戻す
heroku rollback -a portfolio-staging
# (引数なしの rollback は前回のリリースに戻す)
```

実演結果は `ops/reports/availability-YYYY-MM.md` または個人メモに記録。

## それでも復旧しない場合

1. Heroku Status を確認: <https://status.heroku.com/>
2. Heroku 全体障害なら [disaster-recovery.md](./disaster-recovery.md)（未作成・IT-2 で整備）
3. 直近 2〜3 リリース前にもさらに戻す：`heroku rollback v40 -a portfolio-prod`
4. すべて失敗するなら緊急修正 PR を作成し [hotfix.md](./hotfix.md)（未作成）

## 関連

- [deploy.md](./deploy.md)
- [運用要件 - 障害対応設計](../../docs/design/operation.md#障害対応設計)
- [運用要件 - 障害パターンと初動](../../docs/design/operation.md#障害パターンと初動)
