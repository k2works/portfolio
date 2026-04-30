# ADR-0001: フロントエンドフレームワークに Astro を採用する

採用・営業向け個人ポートフォリオサイトのフロントエンド基盤として Astro を採用する。

日付: 2026-04-30

## ステータス

2026-04-30 承認

## コンテキスト

- ポートフォリオサイトの目的は採用・営業向け個人プロフィールの公開（ヒアリング 1-A）。
- 動的機能は不要、データは Markdown/MDX 中心（ヒアリング 2-A）。
- 既存 MkDocs ドキュメントは別パスで残し、ポートフォリオ本体は別途 SSG で構築する方針（ヒアリング 3-B）。
- SEO・初期表示速度・運用容易性が優先される。
- レンダリング戦略は SSG（静的生成）が最適（更新頻度低・SEO 高）。

候補として以下を比較した：

| 候補 | 静的中心の最適化 | バンドル最小化 | Markdown/MDX 統合 | 学習コスト | 運用実績 |
|---|:---:|:---:|:---:|:---:|:---:|
| **Astro** | ◎（Islands、Zero JS by default） | ◎ | ◎（Content Collections） | ○ | ○ |
| Next.js (SSG) | ○ | △ | ○ | △（App Router の概念多） | ◎ |
| SvelteKit (adapter-static) | ○ | ○ | ○ | ○ | ○ |
| Hugo / Jekyll | ◎ | ◎ | ◎ | △（Go テンプレート） | ◎ |

## 決定

Astro を採用する。

理由：

1. **Zero JS by default**: 文章中心のポートフォリオで JS を強制しない設計が最も適合。Lighthouse スコアの上限を引き上げやすい。
2. **Content Collections**: Markdown フロントマターを Zod スキーマで型検証でき、コンテンツ追加時のミスをビルド時に検出できる。
3. **Islands Architecture**: 必要な箇所のみ React/Preact/Svelte のいずれかで動的化可能。将来コンタクトフォーム等を後付けする際の選択肢が広い。
4. **MkDocs との並列運用**: Astro 側で `/`、MkDocs を `/docs/` 配下にマウントする運用が自然に成立する。
5. **TypeScript ファースト**: 設定・コンテンツ・コンポーネントすべてで TypeScript の支援を受けられる。

Next.js は採用しない。SSR/ISR の機能を活かせず、App Router の複雑さがオーバーヘッドになるため。Hugo/Jekyll は柔軟な UI コンポーネント実装が困難で、将来の動的化に向かない。

## 影響

### 良い影響

- Lighthouse Performance 90 以上を狙える初期構成が組みやすい。
- コンテンツ（works / posts）を Markdown で運用でき、Git のみで完結する。
- Tailwind CSS / astro-icon / Playwright などのエコシステムが揃う。

### 悪い影響・リスク

- Astro エコシステムは Next.js ほど成熟していない（バージョンアップ追従が必要）。
- ハイドレーションが必要なコンポーネントを増やすと Astro の利点が薄れる。導入指針を運用ルールで明文化する。
- 採用例として Next.js を期待する読み手（採用担当者）への補足説明が必要になる場合がある。

### 取り消し可能性

ビルド成果物は静的 HTML/CSS/JS のため、将来 Next.js Static Export や SvelteKit static に乗り換えた場合の出力先（`dist/`）と Heroku 配信レイヤー（Express）は流用できる。乗り換えコストは中程度。

## コンプライアンス

- `apps/web/` 配下の `package.json` 依存に `astro` が存在することを CI で確認する。
- 新規ページは Astro Content Collections のスキーマに準拠する。CI のビルド失敗で逸脱を検出する。
- ハイドレーションを伴うコンポーネントは PR レビューで必要性を検証する。

## 備考

- 著者: ポートフォリオプロジェクト（k2works/portfolio）
- 関連ドキュメント:
  - [フロントエンドアーキテクチャ](../design/architecture_frontend.md)
  - [バックエンドアーキテクチャ](../design/architecture_backend.md)
- 再評価のトリガー: Astro v5 以降の破壊的変更、または動的機能比率が 30% を超えた場合。
