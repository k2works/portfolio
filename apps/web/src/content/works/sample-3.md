---
title: "EC サイトのインフラ自動化"
summary: "オンプレ運用だった EC サイトを AWS にリフトアップし、IaC と CI/CD で運用工数を 70% 削減した。"
role: "DevOps エンジニア"
period:
  from: "2023-10"
  to: "2024-03"
tech:
  - AWS
  - Terraform
  - GitHub Actions
  - Docker
domain: "EC"
category: "インフラ"
team_size: 2
position: "DevOps エンジニア"
involvement: "core"
featured: false
---

## 課題

オンプレミス環境での運用が属人化し、リリースのたびに数時間のメンテナンス停止が発生していた。

## 挑戦

ECS + ALB + RDS のマネージドスタックへの移行を 6 ヶ月で完遂。Terraform でインフラ定義を完全コード化。

## 解決

開発・ステージング・本番の 3 環境を Terraform module で統一管理。GitHub Actions の OIDC 連携で IAM Role を最小権限に維持しつつ、ブルー / グリーンデプロイで無停止リリースを実現。

## 成果

- 運用工数: 月 80 時間 → 月 24 時間（70% 削減）
- リリース停止時間: 平均 3 時間 → 0 分
- 環境構築時間: 2 営業日 → 30 分
