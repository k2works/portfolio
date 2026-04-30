---
title: "社内総務ポータルシステム（クローズド）"
summary: "社員が情報・申請・問い合わせを 1 ヶ所で完結できる社内ポータル。お知らせ / カレンダー / ドキュメント / マニュアル / 社員情報 / 申請ワークフロー / 問い合わせ FAQ の 8 機能を TypeScript / React / Fastify / Prisma で統合。組織内クローズド運用のため詳細は非公開。"
role: "オーナー / フルスタック開発（AI 4 ツール協働）"
period:
  from: "2026-01"
  to: "2026-03"
tech:
  - TypeScript
  - React
  - Vite
  - Fastify
  - Prisma
  - MySQL
domain: "社内 IT / 総務（業界特定情報は非公開）"
category: "社内ポータル / 業務支援"
team_size: 1
position: "オーナー / フルスタック開発者"
involvement: "lead"
featured: false
---

## 課題

社員が必要な情報や業務リソースにアクセスしようとすると、お知らせ・カレンダー・ドキュメント・マニュアル・社員情報・申請ワークフロー・FAQ などがすべて別々のシステムに分散しており、業務効率と情報共有の質を著しく下げていた。中小規模の組織で「情報の総合窓口」として機能する社内ポータルを、短期間でモダンな技術スタックで立ち上げる必要があった。

## 挑戦

8 機能（お知らせ / カレンダー / ドキュメント / マニュアル / 社内ツール / 社員情報 / 申請ワークフロー / 問い合わせ FAQ）を 1 つのポータルに統合する挑戦。短期間で内製するため、フロントとバックエンドの双方で **TypeScript 統一** + **モダンスタック（React + Vite + Fastify + Prisma）** を採用し、AI 4 ツール（Claude / Copilot / Codex / Gemini）と協働して開発速度を最大化する。

## 解決

`apps/backend` + `apps/frontend` の npm workspaces monorepo 構成で、Fastify + Prisma の API と React + Vite の SPA を一体管理。MySQL 8 をデータストアとして Prisma ORM でスキーマ駆動開発を実現。`gulpfile.js` の `gulp dev` / `gulp setup` / `gulp deploy:dev` / `gulp deploy:prd` で開発・デプロイの全工程を統一し、Windows / macOS / Linux いずれでも同じ手順で動作する。MkDocs で社員向け運用ドキュメントを配信、`flake.nix` で再現可能な開発環境を提供。

## 成果

| 指標         | Before                   | After                                                             |
| ------------ | ------------------------ | ----------------------------------------------------------------- |
| 機能統合     | 各機能が別システムで分散 | **8 機能を 1 ポータルに統合**                                     |
| 技術スタック | レガシー混在             | TypeScript で完全統一（フロント + バック + ORM）                  |
| 開発環境     | 各人ローカル設定         | Docker Compose + flake.nix で再現可能                             |
| リリース運用 | 手動                     | `gulp release:patch` / `release:minor` / `release:major` の標準化 |
| 継続実装     | -                        | **約 2 ヶ月で 80 PR マージ、v3.4.0 リリース**                     |

主要数値の要約：

- 8 機能を 1 ポータルに統合し、社員の **情報アクセス窓口** を一本化
- 約 **2 ヶ月で 80 PR** をマージ、`v3.4.0` までリリース
- TypeScript / React / Vite / Fastify / Prisma の **モダンスタック完全統一**
