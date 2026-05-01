---
category: Infrastructure
name: Terraform
since: 2018
status: current
level: 4
works:
  - multi-gen-aws-iac
  - business-saas-aws-iac
  - ec-sales-system-ops
order: 3
---

AWS / Heroku Provider を用いた IaC。state ファイルの S3（暗号化）集中管理、共通 module 化（network / compute / database / security）による多環境（live/{global, mgmt, prod, stage}）並走、世代別マイグレーションでのディレクトリ分離、tflint / gitleaks の CI 統合経験あり。
