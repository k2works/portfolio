# 採用面接前後の Merge Freeze ルール

## 概要

採用面接が予定されている期間中、production への変更を hotfix のみに制限し、面接前後の停止リスクを最小化するルールです。

> **本書のステータス**: スケルトン（IT-2 で配置）。最初の面接予定が入ったら具体化します。

## 動機

- ポートフォリオサイトは採用判断の最初の接点
- 面接当日にサイトが落ちている / 表示崩れがある = 採用機会の損失
- SLO 99.5% は許容するが、面接前後の特定 24 時間は実質 100% を目指す
- 個人運用では「うっかり deploy で壊す」が最大のリスクのため、ルール化が効果的

## ルール

### Freeze 期間

| 状況 | Freeze 開始 | Freeze 終了 |
|---|---|---|
| 採用面接 | 面接予定日の **2 営業日前 19:00** | 面接終了 + 2 時間後 |
| 重要なネットワーキングイベント | 当日朝 | 終了 + 2 時間後 |
| 営業案件のクライアント初回打ち合わせ | 同上 | 同上 |

### Freeze 中の制限

| 種別 | 通常時 | Freeze 中 |
|---|---|---|
| コンテンツ追記（Markdown のみ） | 自由 | **禁止** |
| 機能変更（コード） | PR レビュー | **禁止** |
| 依存性アップデート（Dependabot） | 都度マージ | **マージ保留** |
| hotfix（SEV-1 のみ） | 即時 | **即時（許可）** |
| ローカル開発（develop ブランチ） | 自由 | 自由（main へ反映しない） |

> **唯一の例外**: 「サイトが既に壊れている」場合の hotfix のみ許可。それ以外は面接終了まで待機。

## 運用フロー

### 1. 面接予定の登録

面接が決まったら：

```bash
# ops/calendar.md（IT-2 では未作成、必要なら追加）に記録
# または個人カレンダー（Google Calendar 等）に登録
echo "$(date -d '+2 days' +%Y-%m-%d) 19:00 freeze開始: $(date -d '+4 days' +%Y-%m-%d) 18:00 面接" >> ops/calendar.md
```

### 2. Freeze 開始時のチェック

Freeze 開始時刻に以下を実施：

```bash
# サイトが現在生存しているか確認
curl -fsS https://portfolio.example.com/healthz
# 期待値: ok

# 主要ページを目視
open https://portfolio.example.com/
# ヘッダ / ホーム / Featured Works / Skills が表示されることを確認

# UptimeRobot のステータス
# ダッシュボードで green を確認
```

問題があれば即時対応。

### 3. Freeze 中の運用

- main ブランチへの push を控える
- Dependabot PR は受付するが merge は freeze 終了後
- 緊急時のみ hotfix（SEV-1）

### 4. 面接当日の朝

```bash
# サイトの最終確認
curl -fsS https://portfolio.example.com/healthz
curl -I https://portfolio.example.com/

# 主要ページを面接担当者と同じ条件で目視
# - PC（Chrome / Firefox 最新）
# - スマホ（候補者は移動中に見る可能性）
```

### 5. 面接終了 + 2 時間後

Freeze 解除：

- 保留中の Dependabot PR をマージ
- 通常運用に戻る

## ステータスページ的な記録（任意）

`ops/calendar.md` を以下のような形で運用：

```markdown
# Calendar

## 面接 / Freeze 一覧

| 開始日時（freeze 開始） | 面接日時 | 終了日時（freeze 解除） | 相手 |
|---|---|---|---|
| 2026-05-15 19:00 | 2026-05-17 14:00 | 2026-05-17 16:00 | 〇〇社 一次面接 |

```

これは個人運用なので公開しない（`ops/calendar.md` は `.gitignore` で除外を検討）。

## 失敗時の影響緩和

万が一面接当日に問題が発生した場合：

1. [hotfix.md](./hotfix.md) または [rollback.md](./rollback.md) で即時復旧
2. 30 分以上復旧しないなら [disaster-recovery.md](./disaster-recovery.md) で GitHub Pages 退避
3. 面接で「サイトをご覧ください」と案内する代わりに「GitHub リポジトリ（k2works/portfolio）をご覧ください」へ誘導

## チェックリスト

### Freeze 開始時

- [ ] サイト生存確認（`/healthz` 200）
- [ ] 主要ページ目視
- [ ] UptimeRobot green
- [ ] 自分のカレンダーに「freeze 中」の予定を入れる

### 面接当日朝

- [ ] サイト生存確認
- [ ] 主要ページ目視（PC + スマホ）
- [ ] OGP プレビュー確認（Twitter Card Validator や https://opengraph.xyz/）

### Freeze 解除時

- [ ] 保留中の PR / Dependabot を確認・マージ
- [ ] 次の Freeze 予定を確認

## 関連

- [hotfix.md](./hotfix.md)
- [rollback.md](./rollback.md)
- [disaster-recovery.md](./disaster-recovery.md)
- [運用要件 - 採用面接前後の停止回避](../../docs/design/operation.md#sla--slo)
