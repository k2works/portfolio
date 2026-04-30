# Runbook

ポートフォリオサイトの運用手順書を集約します。すべて個人運用前提で、SLO 99.5%（月間ダウンタイム約 3.6 時間）を維持するための日常 / 緊急対応をまとめています。

詳細な運用設計は [運用要件](../../docs/design/operation.md) を参照。

## ファイル一覧

| ファイル | 用途 | ステータス |
|---|---|---|
| [README.md](./README.md) | 入口・目次（本ファイル） | 整備済み |
| [deploy.md](./deploy.md) | 通常リリース手順（main マージ → staging → 手動 promote） | スケルトン（IT-1） |
| [rollback.md](./rollback.md) | Slug ロールバック手順 | スケルトン（IT-1） |
| hotfix.md | SEV-1 緊急修正フロー | 未作成（IT-2） |
| disaster-recovery.md | Heroku 全停止時の GitHub Pages 退避 | 未作成（IT-2） |
| handover.md | チーム化 / 引継ぎ資料 | 未作成（IT-2 以降） |
| on-call.md | オンコール時の初動チェックリスト | 未作成（IT-2） |
| secret-rotation.md | 90 日ごとのシークレットローテーション手順 | 未作成（IT-3） |
| domain-renewal.md | ドメイン更新手順 | 未作成（v1.0 後） |
| pre-interview-freeze.md | 面接前後の merge freeze ルール | 未作成（IT-2） |
| [postmortem/](./postmortem/) | SEV-1 / SEV-2 障害事後報告（YYYY-MM-DD-slug.md） | ディレクトリのみ |

## 利用ガイド

| 状況 | 参照先 |
|---|---|
| 新規リリースをデプロイしたい | [deploy.md](./deploy.md) |
| 直近のリリースで障害発生 → 切り戻したい | [rollback.md](./rollback.md) |
| 採用面接が近い → リスクのある変更を控えたい | pre-interview-freeze.md（未作成） |
| シークレットを更新したい | secret-rotation.md（未作成） |
| Heroku が完全停止 | disaster-recovery.md（未作成） |
| 障害事後の振り返り | postmortem/YYYY-MM-DD-slug.md を新規作成 |

## SEV レベル

| レベル | 状態 | 例 | 対応時間 |
|---|---|---|---|
| SEV-1 | サイト全停止 | Dyno クラッシュループ、Heroku Region 障害 | 30 分以内 best effort |
| SEV-2 | 一部画面停止 / 性能劣化 | 特定ルート 500、Lighthouse < 70 | 翌営業日 |
| SEV-3 | 機能影響なし / 警告のみ | リンク切れ、画像最適化失敗 | 1 週間以内 |

詳細は [運用要件 - 障害対応設計](../../docs/design/operation.md#障害対応設計) を参照。

## 関連ドキュメント

- [運用要件](../../docs/design/operation.md)
- [非機能要件](../../docs/design/non_functional.md)
- [Heroku staging 環境セットアップ手順書](../../docs/operation/heroku_staging_setup.md)
