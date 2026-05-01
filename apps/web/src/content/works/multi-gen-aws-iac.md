---
title: "社内システム向け世代別 AWS インフラ導入支援（クローズド）"
summary: "Rails 系の社内システムについて、第 1 世代（手作業 + OpsWorks 時代の Terraform 雛形）から第 2 世代（Terraform module 整理 + App Runner + Packer + 拠点間 VPN + SSM Parameter Store）へ段階的にモダナイズする世代別インフラ導入支援。アプリケーションは対象外。組織内クローズド運用のため詳細は非公開。"
role: "インフラ IaC 担当 / 世代別マイグレーション"
period:
  from: "2018-10"
  to: "2024-03"
tech:
  - Terraform
  - Ansible
  - Chef
  - Packer
  - Docker
  - AWS
  - App Runner
  - Elastic Beanstalk
  - Site-to-Site VPN
domain: "社内システム（業界特定情報は非公開）"
category: "AWS インフラ IaC 世代別マイグレーション"
team_size: 1
position: "インフラ IaC 担当 / 世代別マイグレーション"
involvement: "core"
featured: false
---

## 課題

長期運用される社内システムの AWS インフラは、運用開始から年月を重ねるなかで、**手作業構築・旧 OpsWorks・古い Terraform 構造・Chef ベースの構成管理** といった「第 1 世代の負債」を抱えていた。AWS の新サービス（App Runner / SSM Parameter Store 等）を取り込みたい一方で、稼働中の本番影響リスクを最小化しながら段階的に置き換える必要があった。**アプリケーション本体（Rails）は対象外**、本案件はインフラ導入支援に限定。

## 挑戦

世代を分けて並走させる挑戦。`ops/1G/` に既存資産（手作業 AWS CLI スクリプト + 古い Terraform + Chef cookbook）を凍結保守しながら、`ops/2G/` で **Terraform module 構造の刷新**（live/{global, mgmt, prod, stage} の 4 環境分離 + modules を compute / container / database / networking / security / management_governance に再編）+ **Packer + Ansible で AMI を再現可能化** + **App Runner / Elastic Beanstalk / EC2 を用途別に選択** + **複数拠点間の Site-to-Site VPN** + **SSM Parameter Store でシークレットを集中管理** という第 2 世代を構築。世代間で混乱が起きないよう、ディレクトリレベルで完全分離した。

## 解決

`ops/1G/build/{terraform, ansible, chef, aws}` に既存運用を凍結保守。`ops/2G/build/terraform/live/` を `global / mgmt / prod / stage` の 4 環境に分離し、共通 modules を 6 系統（compute / container / database / management_governance / networking_content_delivery / security_identify_compliance）で再構成。EC2 / Elastic Beanstalk / App Runner を用途に応じて選択可能にし、ECR で Docker イメージを管理。Packer の `aws-amazon-linux2.pkr.hcl` で Ansible playbook を呼び出し AMI を再現可能化。複数拠点（本社 / 支社）間の Site-to-Site VPN を Terraform で管理し、Resource Group `ApplicationGroup` でリソース可視化。SSM Parameter Store にシークレット（DB 接続情報・API キー）を集中管理し、tfstate は S3（暗号化）で運用。

## 成果

| 指標 | 1G（移行前） | 2G（移行後） |
|---|---|---|
| Terraform 構造 | 単一ディレクトリ + 雛形的 module | live/{global, mgmt, prod, stage} + 6 系統 modules |
| Compute 選択肢 | EC2 + Elastic Beanstalk + 旧 OpsWorks | EC2 + Elastic Beanstalk + App Runner |
| AMI 管理 | Chef cookbook（手元ビルド） | Packer + Ansible（再現可能 AMI） |
| シークレット管理 | 環境変数直書き | SSM Parameter Store（暗号化） |
| 拠点間接続 | 単一 VPN connection | 複数拠点間 Site-to-Site VPN |
| Container | なし | ECR + multicontainer Docker（EB）|
| リソース可視化 | なし | Resource Group `ApplicationGroup` |
| 開発者ローカル環境 | 手作業（Vagrant / Chef） | Packer + Ansible で AMI 共有 |

主要数値の要約：

- **約 5 年半** にわたり 1G → 2G の世代横断インフラ導入支援を継続
- **ディレクトリレベルでの世代分離**（`ops/1G/` と `ops/2G/`）により、稼働中の本番に触れることなく段階的に新世代へ移行
- 旧 OpsWorks / Chef 中心構成から **App Runner / Packer + Ansible / SSM Parameter Store** を活用したモダン構成へ
- アプリケーション本体（Rails）は対象外、**インフラ導入支援のみ** の役割で完遂
