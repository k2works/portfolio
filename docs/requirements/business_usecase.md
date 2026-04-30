# ビジネスユースケース

## 概要

ポートフォリオサイトを取り巻くビジネス活動（採用 / 営業 / 学習継続）を、訪問者の業務視点で記述する。システムユースケースの上位文脈となる。

## アクター

| アクター | 役割 | 主な関心事 |
|---|---|---|
| 採用担当者 | 人事・技術リーダー、応募者を評価 | 専門性 / 経験 / 人柄 / 入社判断 |
| 業務委託発注検討者 | 営業案件の決裁者 | 稼働可否 / 経験領域 / 料金感 / 連絡可否 |
| 同業エンジニア | 興味本位の閲覧者 | 技術的深さ / 思考プロセス / 参考になるか |
| サイトオーナー | 自分自身（k2works） | 自己ブランディング / 持続可能な運用 |

## ビジネスユースケース一覧

| BUC ID | ユースケース | 主アクター | 関連 |
|---|---|---|---|
| BUC-01 | 候補者の一次スクリーニングを行う | 採用担当者 | UC-01〜04 |
| BUC-02 | 候補者の技術評価を行う | 採用担当者 / 採用技術リーダー | UC-02, UC-03 |
| BUC-03 | 業務委託先の検討・選定 | 業務委託発注検討者 | UC-01, UC-03, UC-04, UC-05 |
| BUC-04 | 連絡を取る | 訪問者全般 | UC-06 |
| BUC-05 | 技術的好奇心の充足 | 同業エンジニア | UC-07 |
| BUC-06 | コンテンツの追加・更新 | サイトオーナー | UC-08 |
| BUC-07 | 採用面接前後のサイト稼働確保 | サイトオーナー | UC-09 |
| BUC-08 | 緊急時の障害対応 | サイトオーナー | UC-10 |

## 主要ビジネスフロー

### BUC-01: 候補者の一次スクリーニング

```plantuml
@startuml
actor "採用担当者" as recruiter
participant "求人媒体 / 履歴書" as source
participant "ポートフォリオサイト" as portfolio
participant "社内 ATS" as ats

recruiter -> source : 応募候補を確認
source -> recruiter : URL を含む応募情報
recruiter -> portfolio : ホームを開く
portfolio -> recruiter : プロフィール / 得意領域 / Featured Works
note right
  30 秒で「誰がどんな専門領域か」
  を把握する
end note
alt 関心が湧く
  recruiter -> portfolio : Works 一覧で実績傾向を確認
  recruiter -> portfolio : Skills で技術網羅性を確認
  recruiter -> ats : 「面談へ進める」判断を記録
else 関心が湧かない
  recruiter -> ats : 「不採用」判断を記録
end
@enduml
```

**成功基準**: 採用担当者が 2 分以内に「面談へ進めるかどうか」の判断ができる。

### BUC-03: 業務委託先の検討・選定

```plantuml
@startuml
actor "業務委託発注検討者" as client
participant "ポートフォリオサイト" as portfolio
participant "Email" as mail

client -> portfolio : ホームを訪問
portfolio -> client : プロフィール / 得意領域 / Contact リンク
client -> portfolio : Contact を確認
portfolio -> client : 稼働可否 (availability) / 連絡手段
alt 稼働可能 + 経験領域に合致
  client -> portfolio : Works 詳細を確認
  portfolio -> client : 役職 / チーム規模 / 関与の深さ / 成果
  client -> mail : 問い合わせメール送信
  mail -> client : 2 営業日以内に返信
else 稼働不可 or 経験不足
  client -> portfolio : 離脱
end
@enduml
```

**成功基準**: 業務委託発注検討者が「問い合わせる価値があるか」を 5 分以内に判断できる。

### BUC-07: 採用面接前後のサイト稼働確保

```plantuml
@startuml
actor "サイトオーナー" as owner
participant "面接予定カレンダー" as cal
participant "GitHub Actions" as ci
participant "Heroku" as heroku
participant "Cloudflare" as cf
participant "GitHub Pages\n(常時ミラー)" as pages

owner -> cal : 面接日程を記録
owner -> ci : 面接 2 営業日前から main マージは hotfix のみ
note right
  通常変更を停止することで
  本番障害リスクを下げる
end note
owner -> heroku : 当日朝に /healthz で生存確認
alt Heroku 障害が発生
  owner -> cf : DNS の CNAME を Pages に切替
  cf -> pages : フォールバック配信
  pages -> owner : 採用担当者にはサイト断絶を見せない
end
@enduml
```

**成功基準**: 面接前後 24 時間で SLO（99.5%）を超えた可用性を維持できる。

### BUC-05: 技術的好奇心の充足（同業エンジニア）

```plantuml
@startuml
actor "同業エンジニア" as peer
participant "ポートフォリオ (/)" as port
participant "Tech Notes (/docs/)" as docs
participant "ADR" as adr

peer -> port : SNS / 検索流入
port -> peer : Works 詳細
peer -> port : Tech Notes ナビをクリック
port -> docs : `/docs/` へ遷移（同一タブ）
docs -> peer : リファレンス / テンプレート / ADR
peer -> adr : 興味のある ADR を読む
adr -> peer : 技術的決定の根拠と代替案
@enduml
```

**成功基準**: 同業エンジニアが技術的詳細・思考プロセスに満足し、SNS でシェアする等の二次行動を起こす。

## ビジネスルール

| BR ID | ルール | 由来 |
|---|---|---|
| BR-01 | 連絡には 2 営業日以内に返信する | UI 設計 (S05) |
| BR-02 | 面接 2 営業日前から hotfix 以外の変更を停止 | レビュー（User Rep） |
| BR-03 | Tech Notes は採用ノイズになるため初期は noindex | [ADR-0003](../adr/0003-mkdocs-coexistence-strategy.md) |
| BR-04 | コンタクト手段は外部チャネル（mailto/GitHub/LinkedIn）に集約、フォームは v1 では持たない | ヒアリング 2-A |
| BR-05 | コンテンツ更新は Markdown + Git で完結する（CMS は導入しない） | 持続可能性 |
| BR-06 | 個人情報（氏名以外）はサイト上で記録・収集しない | プライバシー |
| BR-07 | Cookie バナーは設定しない（クッキー未使用） | [非機能要件](../design/non_functional.md) |

## 関連ドキュメント

- [要件定義書](./requirements_definition.md)
- [システムユースケース](./system_usecase.md)
- [ユーザーストーリー](./user_story.md)
- [UI 設計](../design/ui_design.md)
