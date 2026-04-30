---
title: "デザインパターンからはじめるプログラミング入門 — AI 時代の写経"
summary: "デザインパターンとソフトウェア開発の原理原則を TDD で写経して学ぶ教材。getting-started-tdd / algorithm の経験を活かし、Codespaces + AI 4 ツール連携で快適に学習できる。"
role: "オーナー / 単独開発（AI 4 ツール協働）"
period:
  from: "2026-04"
tech:
  - Markdown
  - Gulp
  - MkDocs
  - Codespaces
  - AI Pair Programming
domain: "学習教材 / OSS"
category: "デザインパターン / 原理原則"
team_size: 1
position: "オーナー / 単独開発者"
involvement: "lead"
repo: "https://github.com/k2works/getting-started-design-pattern"
demo: "https://k2works.github.io/getting-started-design-pattern/slide/%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89.html"
featured: false
---

## 課題

GoF のデザインパターンや SOLID などの原理原則は古典として有名だが、写経しながら TDD で実装する形で学べる教材が乏しい。書籍は概念の解説中心で、コードを動かしながら習得する手段が限られていた。

## 挑戦

`getting-started-tdd`（Part 1）と `getting-started-algorithm`（Part 3）で確立した「写経 × TDD × AI 協働」の構造を継承し、デザインパターンと原理原則の写経教材を構築する挑戦。AI 時代の写経シリーズの中で、設計知識の体系化に焦点を当てる。

## 解決

`sandbox` ブランチで写経用の作業環境を分離し、`main` で教材本体を管理。Codespaces で `gh codespace create --branch sandbox` を打つだけで写経環境がブラウザに立ち上がる。教材本体は MkDocs で配信し、スライドも GitHub Pages で同時公開。AI 4 ツール（Claude / Copilot / Codex / Gemini）の YOLO モードで快適に写経できる。

## 成果

| 指標                     | Before           | After                                       |
| ------------------------ | ---------------- | ------------------------------------------- |
| デザインパターン写経教材 | なし             | TDD + AI 協働で写経できる教材               |
| シリーズ位置付け         | 単発教材         | 写経シリーズの一貫構造（Part 1 / 3 / 本作） |
| 公開チャネル             | なし             | GitHub Pages（教材 + スライド）             |
| 起動コスト               | ローカル環境構築 | Codespaces 1 クリック                       |

主要数値の要約：

- AI 時代の写経シリーズ最新作として展開（執筆継続中）
- `sandbox` ブランチ運用で写経作業と教材本体を分離
- Codespaces + AI 4 ツール連携を標準装備
