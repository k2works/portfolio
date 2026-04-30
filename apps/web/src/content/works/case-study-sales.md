---
title: "販売管理システムのケーススタディ"
summary: "Java 25 + Spring Boot + Node.js のフルスタック構成で販売管理を題材にしたケーススタディ。Heroku（バックエンド）+ Vercel（フロントエンド）の分離デプロイ、jig + ERD 自動生成、SonarCloud + qlty による多層的な品質ゲートを完備。"
role: "オーナー / 単独開発（AI 4 ツール協働）"
period:
  from: "2024-10"
  to: "2025-11"
tech:
  - Java
  - Spring Boot
  - TypeScript
  - Heroku
  - Vercel
  - SonarCloud
domain: "販売管理"
category: "業務システム ケーススタディ"
team_size: 1
position: "オーナー / 単独開発者"
involvement: "lead"
repo: "https://github.com/k2works/case-study-sales"
featured: true
---

## 課題

販売管理は受注・売上・請求・在庫など業務フローが横断的で、モデリングと実装の両立が難しい領域。Java + フロントエンド分離 + マルチデプロイの「現代的な業務システム」のリファレンスが乏しい問題があった。

## 挑戦

Java 25 + Spring Boot を最新版で採用し、フロントエンド（Vercel）/ バックエンド（Heroku）/ ドキュメント（Vercel）の **3 系統デプロイ** を 1 リポジトリで管理。`jig` でドメインモデルの可視化を CI に組み込み、ERD 自動生成と組み合わせて「コードからドキュメント」を貫通する設計を目指した。

## 解決

Java CI（Gradle）+ Node.js CI（Jest）+ Heroku Production / Develop + Vercel Production / Develop + SonarCloud + qlty Maintainability + Coverage の **8+ GitHub Actions ジョブ** を完備。`gulp jig` でドメインモデル図、`gulp jig_erd` で ERD を自動生成し、MkDocs で全ドキュメントを統合配信。約 1 年の継続改善で 103 PR をマージ。

## 成果

| 指標               | Before       | After                                                                             |
| ------------------ | ------------ | --------------------------------------------------------------------------------- |
| デプロイ系統       | 単一系統想定 | バックエンド（Heroku）+ フロントエンド（Vercel）+ ドキュメント（Vercel）の 3 系統 |
| 品質ゲート         | 単一指標     | SonarCloud + qlty + Code Coverage の三重ゲート                                    |
| ドキュメント自動化 | 手動         | ドメインモデル + ERD + MkDocs を CI で自動生成                                    |
| 継続実装           | -            | **103 PR マージ / 約 13 ヶ月**                                                    |

主要数値の要約：

- Java 25 + Spring Boot 4 + Node.js 24 のフルスタック構成
- バックエンド / フロントエンド / ドキュメントの **3 系統独立デプロイ** を CI で自動化
- 13 ヶ月で **103 PR** をマージし継続改善を実証
