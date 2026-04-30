# フロントエンドアーキテクチャ

## 概要

採用・営業向けの個人プロフィールサイトとして、SEO・初期表示速度・保守容易性を優先したフロントエンドを構築する。既存の MkDocs ドキュメントサイトはそのまま維持し、本ドキュメントが対象とするのは**ポートフォリオのトップページとサブページ群**である。

## レンダリング戦略

### 判断結果

| 判断軸 | 判定 |
|---|---|
| SEO 重要性 | 高（採用担当者の検索流入を想定） |
| 更新頻度 | 低〜中（プロフィール・実績の追記が中心） |
| 動的データ | なし |
| 採用戦略 | **SSG（静的サイト生成）** |

サーバーサイドレンダリングは更新頻度・データ動的性が低いため過剰。SPA は SEO・初期表示で不利。SSG が最適。

## フレームワーク選定

### 採用: Astro

| 評価軸 | Astro | Next.js (SSG) | SvelteKit (static) |
|---|:---:|:---:|:---:|
| 静的中心の最適化 | ◎（Islands、Zero JS by default） | ○ | ○ |
| ビルド成果物のサイズ | ◎ | △ | ○ |
| 学習コスト | ○ | △ | ○ |
| Markdown / MDX 統合 | ◎ | ○ | ○ |
| MkDocs との並列運用 | ◎ | ○ | ○ |
| エコシステム | ○（成長中） | ◎ | ○ |

ポートフォリオは「文章・画像が中心、JS は最小限」であり、Astro の Islands Architecture（必要な箇所だけハイドレーション）が最も適合する。詳細は [ADR-0001](../adr/0001-frontend-framework-astro.md) 参照。

## プロジェクト構造

ガイドの「中小規模シンプル構造」を Astro 標準に合わせて採用する。

```
apps/web/
├── astro.config.mjs       # Astro 設定
├── package.json
├── public/                # そのまま配信される静的アセット（favicon 等）
├── src/
│   ├── components/        # 再利用 UI（Button, Card, Section）
│   ├── layouts/           # BaseLayout, ArticleLayout
│   ├── pages/             # ファイルベースルーティング
│   │   ├── index.astro    # トップ（プロフィール）
│   │   ├── works/         # 成果物一覧・詳細
│   │   ├── skills.astro   # スキルセット
│   │   └── contact.astro  # 連絡先（リンクのみ）
│   ├── content/           # Markdown / MDX のコンテンツ集約
│   │   ├── works/
│   │   └── posts/
│   ├── styles/            # グローバル CSS（Tailwind 設定）
│   └── utils/             # フォーマッタ等
├── server.js              # Heroku 用静的配信プロセス（バックエンドアーキテクチャ参照）
└── tests/
    ├── e2e/               # Playwright
    └── build/             # ビルド成果物検証
```

## 状態管理

ポートフォリオサイトに動的状態管理は不要。例外的に必要となる UI ローカル状態（ハンバーガーメニューの開閉など）は、各 Astro コンポーネント内の素の JavaScript（`<script>` タグ）または Preact Island で完結させ、ストアは導入しない。

将来コンタクトフォームを追加した場合のみ、フォームの一時状態を React Hook Form + Zod で管理する。

## スタイリング

| 項目 | 採用 | 理由 |
|---|---|---|
| 基本 | Tailwind CSS | 開発速度、デザイン一貫性、ビルド時に未使用クラス除去 |
| トークン | CSS カスタムプロパティ | ダークモード切替、ブランドカラー集中管理 |
| アイコン | astro-icon + Iconify | バンドル最小化、SVG オンデマンド |
| フォント | woff2 セルフホスト | 第三者依存削減、Heroku 配信で完結 |

## コンテンツ管理

`src/content/` で Astro Content Collections を利用し、Markdown のフロントマターをスキーマ検証する。これにより、未入力フィールドや型違いをビルド時に検出できる。

```ts
// src/content/config.ts（イメージ）
import { defineCollection, z } from "astro:content";

const works = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    period: z.object({ from: z.string(), to: z.string().optional() }),
    tech: z.array(z.string()),
    repo: z.string().url().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { works };
```

## アクセシビリティ・SEO

| 項目 | 方針 |
|---|---|
| セマンティック HTML | `header / main / nav / article / footer` を厳格に使用 |
| キーボード操作 | フォーカス可視化（Tailwind `focus-visible`）、タブ順序の検証 |
| 色コントラスト | WCAG AA 準拠（4.5:1 以上） |
| OGP / Twitter Card | 全ページで自動生成（`@astrojs/og` or 自前） |
| `sitemap.xml` | `@astrojs/sitemap` で自動生成 |
| `robots.txt` | 公開後に索引許可、ステージング環境は `Disallow: /` |
| Lighthouse 目標 | Performance / SEO / Accessibility いずれも 90 以上 |

## パフォーマンス指標

| 指標 | 目標 |
|---|---|
| LCP | < 2.0s（Heroku Eco Dyno コールドスタート時を除く） |
| CLS | < 0.05 |
| TBT | < 100ms |
| 初期 JS バンドル | < 30 KB（gzip） |
| 画像配信 | `astro:assets` で最適化、AVIF/WebP 優先 |

## テスト戦略

| レベル | 内容 | ツール |
|---|---|---|
| 静的解析 | TypeScript / ESLint / Prettier | tsc, eslint, prettier |
| ユニット | 純粋関数、ユーティリティ | Vitest |
| ビジュアル | コンポーネントのスナップショット | Playwright Snapshot |
| E2E | ナビゲーション、リンク、OGP | Playwright |
| Lighthouse | パフォーマンス・アクセシビリティ予算 | Lighthouse CI |

## 開発フロー

1. `apps/web/` を npm workspace として `package.json` に登録
2. `npm run dev`: Astro dev server（port 4321）
3. `npm run build`: `apps/web/dist/` にビルド成果物を出力
4. `npm run preview`: 本番相当の確認
5. CI: lint → test → build → Lighthouse CI → Heroku デプロイ（[インフラ](./architecture_infrastructure.md) 参照）

## 既存 MkDocs サイトとの関係

| 項目 | 方針 |
|---|---|
| 役割分離 | Astro = ポートフォリオ表紙 / MkDocs = 学習・設計ドキュメント |
| URL 設計 | Astro: `/`, `/works`, `/skills` / MkDocs: `/docs/` 配下 |
| 配信 | 同一 Heroku Dyno 内の Express で双方を配信（`/docs` を MkDocs ビルド成果物にマッピング） |
| ビルド | CI 内で MkDocs ビルド → `apps/web/dist/docs/` に出力 → Astro ビルド成果物と統合 |

詳細は [インフラストラクチャアーキテクチャ](./architecture_infrastructure.md) 参照。

## 関連ドキュメント

- [バックエンドアーキテクチャ](./architecture_backend.md)
- [インフラストラクチャアーキテクチャ](./architecture_infrastructure.md)
- [ADR-0001: フロントエンドフレームワークに Astro を採用](../adr/0001-frontend-framework-astro.md)
