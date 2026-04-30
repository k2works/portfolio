---
title: "会計システムのケーススタディ"
summary: "会計システムを題材に、要件定義から実装まで DDD + TDD + クリーンアーキテクチャを実践したケーススタディ。バックエンド / フロントエンド両方を Heroku にデプロイし、SonarQube + qlty で品質を可視化している。"
role: "オーナー / 単独開発（AI 4 ツール協働）"
period:
  from: "2025-12"
  to: "2026-02"
tech:
  - Java
  - Spring Boot
  - TypeScript
  - Heroku
  - MkDocs
  - SonarQube
domain: "会計"
category: "業務システム ケーススタディ"
team_size: 1
position: "オーナー / 単独開発者"
involvement: "lead"
repo: "https://github.com/k2works/case-study-accounting"
demo: "https://k2works.github.io/case-study-accounting/"
featured: false
---

## 課題

会計システムは業務ロジックが複雑で「正解の実装」が見えにくい領域。書籍の DDD パターンは抽象論にとどまり、要件定義からテスト・デプロイまで一貫した参照実装が乏しかった。

## 挑戦

クリーンアーキテクチャ + DDD + TDD で会計システムを「要件定義 → 設計 → 実装 → デプロイ」まで貫いたケーススタディを 1 人で構築。Java バックエンドと TypeScript フロントエンドを別々の Heroku アプリにデプロイし、双方の CI / SonarQube / qlty コード品質モニタリングを完備する。

## 解決

`apps/backend` と `apps/frontend` の monorepo 構成で、Backend CI / Frontend CI / Backend Deploy / Frontend Deploy / MkDocs / Backend SonarQube / Frontend SonarQube の 7 ジョブを GitHub Actions で並列運用。Heroku 上のデモは `admin / Password123!` で誰でも確認できる。MkDocs で要件定義 → 設計 → 実装の流れを文書化し、ケーススタディとしての再利用性を担保した。

### 公開先

- <a href="https://k2works.github.io/case-study-accounting/" target="_blank" rel="noopener noreferrer">ドキュメント（ケーススタディ本体）↗</a>
- <a href="https://case-study-accounting-frontend-2cb4e7e16f2f.herokuapp.com/login" target="_blank" rel="noopener noreferrer">アプリデモ（会計画面 / `admin` / `Password123!`）↗</a>

## 成果

| 指標                    | Before                                           | After                                          |
| ----------------------- | ------------------------------------------------ | ---------------------------------------------- |
| ケーススタディの完成度  | 要件定義 / 実装 / デプロイのいずれかが欠ける状態 | 全フェーズを 1 リポジトリで完結                |
| デモ稼働状況            | なし                                             | フロントエンド + Swagger UI 両方が常時稼働     |
| 品質モニタリング        | なし                                             | SonarQube + qlty（Maintainability + Coverage） |
| GitHub Actions ジョブ数 | 0                                                | 7 ジョブ（CI / Deploy / SonarQube / MkDocs）   |

主要数値の要約：

- DDD + TDD + クリーンアーキテクチャを **要件定義 → 実装 → デプロイ** まで貫通
- フロント / バック両方を Heroku にデプロイ、Swagger UI 公開
- SonarQube + qlty の **二重コード品質ゲート** を CI に統合
