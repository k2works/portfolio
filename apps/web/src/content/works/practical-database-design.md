---
title: "実践データベース設計：基幹業務システム編"
summary: "販売管理・財務会計・生産管理の 3 業務領域を題材に、業務フローと ER モデルを体系的に解説する技術記事プロジェクト。Java 25 + Spring Boot 4 + MyBatis 4 + PostgreSQL 16 + Flyway + Schemaspy で実装コードと ER 図を自動生成。"
role: "オーナー / 単独執筆"
period:
  from: "2025-12"
  to: "2026-01"
tech:
  - Java
  - Spring Boot
  - MyBatis
  - PostgreSQL
  - Flyway
  - MkDocs
domain: "データベース設計"
category: "技術記事 / 基幹業務システム"
team_size: 1
position: "オーナー / 単独執筆者"
involvement: "lead"
repo: "https://github.com/k2works/practical-database-design"
demo: "https://k2works.github.io/practical-database-design/"
featured: true
---

## 課題

基幹業務（販売管理 / 財務会計 / 生産管理）のデータベース設計は、業務フローとデータモデルの両面を理解する必要がある。書籍は業務知識かデータベース理論のいずれかに偏りがちで、両方を体系的に学べる教材が乏しかった。

## 挑戦

3 つの業務領域（販売管理 sms / 財務会計 fas / 生産管理 pms）それぞれで、業務フロー + ER 図 + 実装コードを 1 リポジトリで体系化する挑戦。日本語テーブル + 日本語カラムでスキーマを定義し、業務担当者にも読める形にする。実装コードは `<details>` タグで折りたたみ、記事の流れを止めない構成にした。

## 解決

PostgreSQL 16 + Flyway でマイグレーションを管理、Schemaspy で ER 図と DB ドキュメントを自動生成（`gulp schemaspy:sms:generate` + `:fas` + `:pms`）。Docker Compose で 3 業務領域の DB を独立起動、MkDocs + PlantUML で業務フロー図と ER 図を統合配信。Spring Boot 4 + MyBatis 4 + JUnit 5 + TestContainers でテストも自動化。3 業務領域それぞれを Heroku 上にデプロイし、ライブデモとして公開している。

### ライブデモ

- <a href="https://deploy-demo-sms-b33828d678a9.herokuapp.com/" target="_blank" rel="noopener noreferrer">販売管理システムデモ ↗</a>
- <a href="https://deploy-demo-fas-6d8f7fd49278.herokuapp.com/" target="_blank" rel="noopener noreferrer">財務会計システムデモ ↗</a>
- <a href="https://deploy-demo-pms-40869571939f.herokuapp.com/" target="_blank" rel="noopener noreferrer">生産管理システムデモ ↗</a>

## 成果

| 指標                   | Before   | After                                           |
| ---------------------- | -------- | ----------------------------------------------- |
| カバー業務領域         | 0        | 販売管理 + 財務会計 + 生産管理 = **3 領域**     |
| ER 図生成              | 手書き   | Schemaspy で全テーブル自動生成                  |
| 実装コードと記事の連動 | バラバラ | `<details>` で 1 記事に統合                     |
| テスト基盤             | なし     | TestContainers で本物の PostgreSQL を CI で起動 |

主要数値の要約：

- **3 業務領域**（sms / fas / pms）を 1 リポジトリで横断的に解説
- Schemaspy + PlantUML + MkDocs で **コードからドキュメント** を完全自動生成
- 日本語テーブル + 日本語カラムで業務担当者と開発者の認識を揃える
