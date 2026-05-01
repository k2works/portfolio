---
title: "業務 SaaS 向け AWS インフラ導入支援（クローズド）"
summary: "Rails 系の業務 SaaS（3 サブドメイン構成）について、手作業で運用されていた AWS インフラを Terraform + Ansible + Chef で完全コード化し、開発 / ステージング / 本番の 3 環境を共通 module で揃えるプロジェクト。アプリケーション本体は対象外、インフラ導入支援のみ。組織内クローズド運用のため詳細は非公開。"
role: "インフラ IaC 担当 / 導入支援"
period:
  from: "2022-04"
  to: "2024-03"
tech:
  - Terraform
  - Ansible
  - Chef
  - AWS
  - Elastic Beanstalk
  - Vagrant
  - Bitbucket Pipelines
domain: "業務 SaaS（業界特定情報は非公開）"
category: "AWS インフラ IaC 導入支援"
team_size: 1
position: "インフラ IaC 担当 / 導入支援"
involvement: "core"
featured: false
---

## 課題

業務 SaaS（3 サブドメイン構成）の AWS インフラは、これまで手作業で構築・改変されてきた経緯があり、**再現性・監査性・変更安全性のいずれも低い** 状態だった。新環境のセットアップに数日かかり、構成ドリフトの検知も困難。本番反映時に意図しない差分が混入するリスクを抱えていた。**アプリケーション本体（Rails）は対象外**、本案件はインフラ導入支援に限定。

## 挑戦

既存運用を止めずに、**Terraform で AWS リソース全体をコード化** + **Ansible で OS / ミドルウェア層をコード化** + **Chef で EC2 ベースイメージを管理** の三層 IaC を実現する挑戦。さらに開発 / ステージング / 本番の 3 環境を **同一 module セット** で安全に並走させ、開発者のローカル環境（Vagrant / WSL）まで構成を統一する必要があった。

## 解決

`build/terraform/` 配下を環境別ディレクトリ（`01_development` / `02_staging` / `03_production` / `99_share`）に分離し、共通の `modules/` を network（VPC / Subnet / Route53 / ACM）/ compute（Elastic Beanstalk / Security Group）/ database（RDS）/ security（IAM）の 4 系統に整理。Ansible playbook は `site_ec2.yml` / `site_stg.yml` / `site_prd.yml` / `site_vagrant.yml` / `site_wsl.yml` で環境別に切り出し、共通 role（amazonlinux2 / awscli / chef / nodejs / provision / ruby / ssh / terraform）を整備。Chef cookbook は Amazon Linux 2 + Ruby ランタイムの差分を再現可能に保守。Bitbucket Pipelines で CI/CD を整備し、tfstate を S3（暗号化）で集中管理した。

## 成果

| 指標               | Before             | After                                |
| ------------------ | ------------------ | ------------------------------------ |
| AWS インフラ構築   | 手作業（数日〜週） | Terraform で再現可能（数十分）       |
| 環境差分           | 手作業ばらつき     | dev / stg / prd を共通 module で揃え |
| 構成ドリフト検知   | なし               | `terraform plan` で差分可視化        |
| EC2 ベースイメージ | 都度手作業         | Chef cookbook で再現可能             |
| 開発者ローカル環境 | 各人手作業         | Vagrant / WSL を Ansible で自動化    |
| tfstate 管理       | ローカル散在       | S3（暗号化 + バックエンドロック）    |
| CI/CD              | なし               | Bitbucket Pipelines で apply ゲート  |

主要数値の要約：

- **約 2 年** の継続支援で IaC 三層化（Terraform + Ansible + Chef）を完成
- **3 環境（dev / stg / prd）** を共通 Terraform module で運用統一
- 開発者のローカル環境を **Vagrant / WSL** の双方で自動構築できるよう Ansible で抽象化
- アプリケーション本体（Rails）は対象外、**インフラ導入支援のみ** の役割で完遂
