---
title: "SaaS フロントエンド再構築"
summary: "React + Redux ベースの SPA を Astro + Server Islands に再構築し、初期表示を 3.2 倍高速化した。"
role: "シニアフロントエンドエンジニア"
period:
  from: "2025-04"
  to: "2025-09"
tech:
  - Astro
  - TypeScript
  - Tailwind CSS
  - Playwright
domain: "SaaS"
category: "フロントエンド"
team_size: 3
position: "シニアフロントエンドエンジニア"
involvement: "core"
featured: true
---

## 課題

JavaScript バンドル肥大化により、モバイル環境での初期表示が 5 秒を超え、離脱率が悪化していた。

## 挑戦

Astro Islands による段階的ハイドレーションと Tailwind CSS 4 の導入で、JS バンドル削減と開発生産性の両立を狙った。

## 解決

主要ページを SSG に変換し、インタラクション領域のみを Server Islands で動的化。E2E と Lighthouse CI でパフォーマンス予算を CI に組み込み、退化検出を自動化。

## 成果

- LCP: 5.1s → 1.6s（3.2 倍高速化）
- 初期 JS バンドル: 280 KB → 32 KB
- Lighthouse Performance: 42 → 94
