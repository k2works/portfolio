---
title: "アルゴリズムからはじめるプログラミング入門 — AI 時代の写経 Part 3"
summary: "アルゴリズムとデータ構造を TDD で写経して学ぶ教材。getting-started-tdd の構造を継承し、Codespaces で 1 クリック起動、Claude / Copilot / Codex / Gemini と協働して写経できる。"
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
category: "アルゴリズム / データ構造"
team_size: 1
position: "オーナー / 単独開発者"
involvement: "lead"
repo: "https://github.com/k2works/getting-started-algorithm"
demo: "https://k2works.github.io/getting-started-algorithm/slide/%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89.html"
featured: false
---

## 課題

アルゴリズムとデータ構造の入門書はあるが、TDD で写経しながら学ぶ教材は少ない。さらに、AI ツールと協働しながら現代的な開発体験で写経できる教材はほぼ存在しなかった。

## 挑戦

`getting-started-tdd`（AI 時代の写経 Part 1）と続編の構造を継承し、アルゴリズムとデータ構造を TDD で実装する教材を作る挑戦。Codespaces で起動コストを最小化し、Claude / Copilot / Codex / Gemini を YOLO モードで連動させた写経環境を提供する。

## 解決

`gulp spec` で写経の進捗管理、`gulp mkdocs:serve` でローカル教材プレビュー、`gulp journal:generate` で写経ジャーナル自動化を統合。`package.json` の `claude:yolo` / `copilot:yolo` / `codex:yolo` / `gemini:yolo` で 4 ツールを同条件で起動できる。短期間（約 3 週間）で集中的に教材を整備し、20 PR をマージした。

## 成果

| 指標                      | Before           | After                                         |
| ------------------------- | ---------------- | --------------------------------------------- |
| アルゴリズム TDD 写経教材 | なし             | TDD ベースの教材一式                          |
| AI 協働ツール統合         | なし             | 4 ツール（Claude / Copilot / Codex / Gemini） |
| 起動環境                  | ローカル環境構築 | Codespaces 1 クリック                         |
| 開発スピード              | -                | **20 PR マージ / 約 3 週間**                  |

主要数値の要約：

- AI 時代の写経シリーズ **Part 3** として展開
- AI 4 ツール統合 + Codespaces 1 クリック起動
- 約 3 週間で **20 PR** をマージし、教材本体を構築
