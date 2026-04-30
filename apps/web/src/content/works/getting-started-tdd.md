---
title: "テスト駆動開発から始めるプログラミング入門 — AI 時代の写経"
summary: "AI 時代の TDD 写経教材。14 言語 × 12 章 + 多言語統合解説 6 章 = 174 章で、Kent Beck 流 TDD の写経から関数型 / OOP の段階的実装まで習得できる。GitHub Codespaces で起動し、Claude / Copilot / Codex / Gemini と協働しながら学べる。"
role: "オーナー / 単独開発（AI 4 ツール協働）"
period:
  from: "2026-02"
tech:
  - Markdown
  - Gulp
  - MkDocs
  - Codespaces
  - AI Pair Programming
domain: "学習教材 / OSS"
category: "TDD プログラミング入門"
team_size: 1
position: "オーナー / 単独開発者"
involvement: "lead"
repo: "https://github.com/k2works/getting-started-tdd"
demo: "https://k2works.github.io/getting-started-tdd/article/"
featured: true
---

## 課題

「TDD を学びたい」と思っても、写経の出発点が見えにくい問題があった。Kent Beck の Money Example は古典として有名だが、現代の言語と AI 環境でどう写経すれば「サークルオブライフ（テクニカル / チーム / ビジネスのプラクティス）」全体に届くのかが不透明だった。さらに、複数言語を横断的に学ぼうとすると環境構築の段階で挫折することが多い。

## 挑戦

14 言語（Java / TypeScript / Python / Ruby / Go / Rust / Swift / Kotlin / C# / F# / Clojure / Scala / Elixir / Haskell）で同じ題材を写経し、各言語の OOP / 関数型 / 型システムの違いをコードで体感できる教材を 1 人 + AI 4 ツール（Claude / Copilot / Codex / Gemini）の協働体制で構築する挑戦。各章で「テスト → 実装 → リファクタリング」を貫きつつ、言語固有のイディオムも紹介する必要があった。

## 解決

各言語ごとに 12 章 × 4 部の構造（環境構築 → 基礎 → OOP/型クラス → 関数型）を共通化し、言語別の差異だけを章内で表現する設計を採用。GitHub Codespaces を 1 クリック起動できるよう `.devcontainer` を整備し、`gh codespace create --repo k2works/getting-started-tdd --branch sandbox` で写経環境がブラウザだけで起動する。`package.json` に `claude:yolo` / `copilot:yolo` / `codex:yolo` / `gemini:yolo` を仕込み、AI とのペアプログラミングを摩擦なく始められるようにした。教材本体は MkDocs + GitHub Pages で配信し、スライドも同時公開している。

### 公開先

- <a href="https://k2works.github.io/getting-started-tdd/article/" target="_blank" rel="noopener noreferrer">教材記事（写経の本体）↗</a>
- <a href="https://k2works.github.io/getting-started-tdd/slide/%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89.html" target="_blank" rel="noopener noreferrer">スライド ↗</a>

## 成果

| 指標          | Before                     | After                                               |
| ------------- | -------------------------- | --------------------------------------------------- |
| 対応言語数    | 0                          | 14 言語（OOP 寄り 6 + 関数型寄り 4 + 静的型寄り 4） |
| 教材章数      | 0                          | 174 章（12 章 × 14 言語 + 統合解説 6 章）           |
| AI 協働ツール | 想定なし                   | 4 ツール（Claude / Copilot / Codex / Gemini）       |
| 起動コスト    | ローカル環境構築（数時間） | Codespaces で 1 クリック起動（数十秒）              |
| 公開チャネル  | なし                       | GitHub Pages（教材 + スライド） + リポジトリ        |

主要数値の要約：

- 14 言語 × 12 章 + 統合解説 6 章 = **174 章** の TDD 写経教材を完成
- AI ツール 4 種類との YOLO モード連携を `package.json` に標準装備
- Codespaces で起動コストを「数時間 → 数十秒」に短縮
- v3.0.0（2026-03-04）でプロジェクト完了、以降は教材改善のメンテナンスフェーズ
