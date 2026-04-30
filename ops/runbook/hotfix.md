# Hotfix（SEV-1 緊急修正）手順

## 概要

production で SEV-1（サイト全停止 / 致命的不具合）が発生し、通常の deploy フローを待てない場合の緊急修正手順です。

> **本書のステータス**: スケルトン（IT-2 で配置）。実 SEV-1 を経験した時点で具体的なコマンド・所要時間を埋めます。

## 適用基準

| 状況 | 適用 |
|---|:---:|
| サイト全停止 | ✅ |
| `/` で 5xx が 5% 以上、5 分以内に解消しない | ✅ |
| セキュリティ脆弱性が既知 | ✅ |
| 採用面接当日にサイト不具合が発生 | ✅ |
| Lighthouse スコア低下のみ | ✗（hotfix 不要、通常 PR で対応） |
| 軽微な表示崩れ | ✗ |

## 判断フローチャート

```text
SEV-1 検知（UptimeRobot / 手動発見）
    ↓
[Q1] 直近デプロイと相関？
    Yes → rollback.md（最速）
    No  → 続行
    ↓
[Q2] Heroku 全停止？
    Yes → disaster-recovery.md（GitHub Pages 退避）
    No  → 続行
    ↓
[Q3] 単一バグの修正で復旧可能？
    Yes → hotfix（本書）
    No  → 暫定対処を試行 + Postmortem
```

## 手順

### 1. インシデント宣言

- 検知時刻を記録（次の Postmortem に使用）
- ステータスページがあれば「調査中」に更新（v0.1 では未整備）
- UptimeRobot のアラートを認知

### 2. hotfix ブランチ作成

```bash
git switch main
git pull origin main
git switch -c hotfix/<short-issue-description>
```

### 3. 最小限の修正

- 修正対象を**バグ箇所だけに限定**。リファクタリングや改善は禁止
- 関連テストを追加（時間が許せば）。許せなければ後追い

### 4. ローカル検証

```bash
cd apps/web
npm run check        # 最低でも lint と test
npm run build        # ビルド成功を確認
node server.js       # /healthz と / の応答確認
```

### 5. 緊急デプロイ

#### A: GitHub Actions 経由（推奨・通常時と同じ）

```bash
git push -u origin hotfix/<issue>
gh pr create --base main --title "fix: <one-line>" --body "SEV-1 hotfix"
gh pr merge --squash --auto
# main マージ → deploy-staging 自動実行 → smoke 確認 → promote
```

#### B: Heroku CLI 経由（CI が動かない場合）

```bash
# ローカルでビルド
cd apps/web
npm run build
cd ../..

# Heroku に直接 push（main 経由ではない）
git push heroku hotfix/<issue>:main --force
```

> Heroku 直接 push は CI を経由しないため、ローカル `npm run check` を必ず通してから実施。

### 6. 復旧確認

```bash
curl -fsS https://portfolio.example.com/healthz
# UptimeRobot で green を確認
# 主要ページを目視確認
```

### 7. main へバックポート

CI/CD 経由でなく Heroku 直接 push した場合は、main にも同じ修正を取り込む：

```bash
git switch main
git pull origin main
git merge hotfix/<issue> --no-ff
git push origin main
```

### 8. Postmortem 起票（必須）

`ops/runbook/postmortem/YYYY-MM-DD-<slug>.md` を作成。SEV-1 は blameless で必ず文書化。

## チェックリスト

- [ ] 検知時刻を記録
- [ ] hotfix ブランチで最小修正
- [ ] ローカル `npm run check` 緑
- [ ] デプロイ
- [ ] `/healthz` 200
- [ ] 主要ページ目視確認
- [ ] UptimeRobot green
- [ ] main へバックポート（直接 push の場合のみ）
- [ ] Postmortem 起票

## 関連

- [rollback.md](./rollback.md)
- [disaster-recovery.md](./disaster-recovery.md)
- [postmortem/](./postmortem/)
- [運用要件 - 障害対応設計](../../docs/design/operation.md#障害対応設計)
