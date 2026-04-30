---
title: "インターネット通販販売管理システム インフラ IaC（クローズド）"
summary: "ec-sales-system（Rails 本体）と ec-sales-system-api（Java + TypeScript API）を支えるインフラを Terraform + Ansible + AWS SAM で完全コード化したプロダクト。手作業構築から再現可能 IaC への移行を主導した。組織内クローズド運用のため詳細は非公開。"
role: "インフラ IaC 担当 / DevOps"
period:
  from: "2023-01"
  to: "2024-08"
tech:
  - Terraform
  - Ansible
  - AWS
  - AWS SAM
  - TypeScript
  - Docker
domain: "EC / インターネット通販（業界特定情報は非公開）"
category: "通販販売管理 インフラ IaC"
team_size: 1
position: "インフラ IaC 担当 / DevOps"
involvement: "core"
featured: false
---

## 課題

通販販売管理システム本体（Rails 3.2、別 Work `ec-sales-system`）と新規 API サービス（Java + TypeScript、別 Work `ec-sales-system-api`）の両方が稼働するインフラは、手作業で構築・改変されてきた経緯があり、**再現性・監査性・変更安全性のいずれも低い** 状態だった。新環境のセットアップに数日かかり、構成ドリフトの検知も困難。AWS リソースの追加・削除のたびに本番影響リスクを抱えていた。

## 挑戦

レガシー本体と新規 API を同一インフラで共存させながら、**Terraform で全 AWS リソースをコード化** + **Ansible で OS / ミドルウェア構成をコード化** + **AWS SAM でサーバレスバッチを管理** の三層で IaC を実現する挑戦。WSL（Windows）と Ubuntu の両環境で同じ playbook が動くよう作業 OS の違いも吸収する必要があった。

## 解決

`build/ansible/` に開発・ステージング・本番の inventory を分離し、`site_docker_legacy.yml` / `site_wsl.yml` 等の playbook を環境別に構成。Terraform で AWS の VPC / ALB / RDS / EC2 / IAM / Route53 を管理し、`bastion` 経由のセキュアアクセスを設計。AWS SAM で `sam-app-nodejs/todo` / `rds-controller` / `sam-app-nodejs-express/api` の 3 つのサーバレス機能を分離管理。GitHub Actions の Terraform CI で plan / apply のレビュー必須化を担保した。

## 成果

| 指標                 | Before         | After                                            |
| -------------------- | -------------- | ------------------------------------------------ |
| インフラ構築         | 手作業（数日） | Terraform + Ansible で再現可能                   |
| 構成ドリフト検知     | なし           | Terraform plan で差分可視化                      |
| サーバレスバッチ     | 個別管理       | AWS SAM で 3 種統合管理                          |
| 開発環境セットアップ | 各人手作業     | Ansible playbook で自動化（WSL / Ubuntu 両対応） |
| CI ゲート            | なし           | Terraform CI で plan / apply レビュー必須        |

主要数値の要約：

- **約 1 年 7 ヶ月** の継続実装で IaC 三層化（Terraform + Ansible + AWS SAM）を完成
- レガシー本体 + 新規 API + サーバレスバッチを **同一 AWS インフラ** で安全に共存運用
- WSL / Ubuntu の作業 OS 差異を Ansible で吸収し、誰でも同じ手順で環境構築可能に
