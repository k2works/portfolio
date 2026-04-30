---
title: "インターネット通販販売管理システム API（クローズド）"
summary: "Rails 3.2 のレガシー販売管理システム（同企業内の別プロダクト）に対する新規 API サービス。Java 21 + Spring Boot + TypeScript + Prisma で外部連携と近代的フロント開発を支える。組織内クローズド運用のため詳細は非公開。"
role: "API 開発担当 / アーキテクト"
period:
  from: "2023-03"
  to: "2025-12"
tech:
  - Java
  - Spring Boot
  - TypeScript
  - Prisma
  - Cypress
  - Gradle
domain: "EC / インターネット通販（業界特定情報は非公開）"
category: "通販販売管理 API サービス"
team_size: 1
position: "API 開発担当 / アーキテクト"
involvement: "core"
featured: false
---

## 課題

10 年以上稼働するレガシー販売管理システム（Rails 3.2、別 Work `ec-sales-system` として登録）は安定運用していたが、外部サービス連携や近代的なフロントエンドからのアクセスを安全に許容するには技術的負債が大きすぎた。一方で本体システムの全面リプレースは業務影響が大きすぎて現実的でなく、**新旧を共存させる戦略** が求められた。

## 挑戦

レガシーシステムを温存しながら、外部連携・新規フロント開発を支える **新規 API サービスを切り出す** 挑戦（ストラングラーパターン的アプローチ）。Java 21 + Spring Boot で堅牢なバックエンドを、TypeScript + Prisma で型安全なデータアクセスとフロント連携を実現。Cypress による E2E 自動化で「API + UI の双方向の品質」を CI で担保する必要があった。

## 解決

`build.gradle` で Spring Boot の API サーバを管理、`prisma/` で TypeScript 側の DB スキーマ管理、`src/` で TypeScript の API クライアント / UI コードを統合した monorepo 風の単一リポジトリ構成。`gulpfile.js` で `gulp dev` / `gulp build` / `gulp deployStaging` / `gulp deployProduction` を統合し、Windows / Unix 両環境で同一手順を提供。Marp + Asciidoctor で社内向けスライド + ドキュメントを構築し、設計判断と運用手順を集約した。

## 成果

| 指標           | Before                             | After                                              |
| -------------- | ---------------------------------- | -------------------------------------------------- |
| 外部連携 API   | レガシーシステム直叩き（リスク高） | Java 21 + Spring Boot の安定 API レイヤー          |
| データアクセス | 生 SQL / ActiveRecord              | Prisma で TypeScript 型安全アクセス                |
| E2E テスト     | なし（手動確認）                   | Cypress で API + UI 統合検証                       |
| デプロイ自動化 | 手動                               | `gulp deployStaging` / `deployProduction` の標準化 |
| 継続実装       | -                                  | **約 2 年 9 ヶ月**（2023-03 〜 2025-12 / 継続中）  |

主要数値の要約：

- レガシー Rails 3.2 を温存しつつ Java 21 + Spring Boot + TypeScript + Prisma の **新規 API レイヤー** を共存運用
- Cypress で API + UI 統合 E2E、`gulp` でクロスプラットフォーム標準化
- 約 **2 年 9 ヶ月** の継続実装で 34+ PR をマージ
