---
title: "会議室予約システムのケーススタディ"
summary: "「Spring 徹底入門」のチュートリアル実装をベースに、戦略・戦術的 DDD と CCSR 手法 + TDD を 2 年強の継続改善で実践した会議室予約システム（MRS）のケーススタディ。"
role: "オーナー / 単独開発"
period:
  from: "2022-02"
  to: "2024-12"
tech:
  - Java
  - Spring Boot
  - Webpack
  - Cypress
  - Jest
domain: "会議室予約 (MRS)"
category: "業務システム ケーススタディ"
team_size: 1
position: "オーナー / 単独開発者"
involvement: "lead"
repo: "https://github.com/k2works/case-study-mrs"
featured: false
---

## 課題

「Spring 徹底入門」の写経だけでは業務システムの全体像（DDD の戦略・戦術 + テスト + CI/CD + 負荷試験）が掴みにくい。書籍はフレームワークの使い方が中心で、業務領域に踏み込んだ DDD 実装の参照例が乏しかった。

## 挑戦

会議室予約という比較的シンプルな業務題材で、戦略的 DDD（境界づけられたコンテキスト）+ 戦術的 DDD（集約・値オブジェクト・ドメインサービス）+ CCSR（増田氏のシステム設計手法）+ TDD + リファクタリングを 2 年強かけて継続的に実践した。

## 解決

Spring Boot + Webpack で API + UI の 1 リポジトリ構成。Cypress で E2E、Jest でフロントエンドユニットテスト、JMeter で負荷試験を統合。`gulp` のタスクランナーで開発体験を一定化し、Gitpod で起動コストを下げた。CodeClimate に連携して継続的に Maintainability / Coverage を監視。

## 成果

| 指標         | Before                 | After                                         |
| ------------ | ---------------------- | --------------------------------------------- |
| 実践フェーズ | フレームワーク学習のみ | 戦略 + 戦術 DDD + TDD + CI + 負荷試験まで貫通 |
| テスト層     | なし                   | Jest（Unit）+ Cypress（E2E）+ JMeter（負荷）  |
| 起動コスト   | ローカル環境構築       | Gitpod 1 クリック                             |
| 継続期間     | 単発のチュートリアル   | **2 年 10 ヶ月の継続改善**                    |

主要数値の要約：

- DDD（戦略 + 戦術）+ CCSR + TDD + リファクタリングを **2 年 10 ヶ月** 継続実践
- 3 層テスト（Jest / Cypress / JMeter）で機能・性能の両面を担保
- Gitpod 統合で起動コストをゼロ近くまで削減
