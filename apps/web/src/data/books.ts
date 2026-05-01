/**
 * 知識バックグラウンドを示す読書リスト（77 冊）。
 * 出典: 個人 wiki の読書メモ（ /books/ ページのソース）。
 * 軸 × カテゴリで分類し、知識構造を可視化する。
 */

export type Axis = "business" | "team" | "tech";

export type Category =
  | "philosophy"
  | "analysis"
  | "requirements"
  | "design"
  | "implementation"
  | "operation";

export interface Book {
  readonly no: number;
  readonly title: string;
  readonly authors: string;
  readonly year: number;
  readonly publisher: string;
  readonly isbn?: string;
  readonly axis: Axis;
  readonly category: Category;
}

export const AXIS_LABEL: Record<Axis, string> = {
  business: "ビジネス",
  team: "チーム",
  tech: "技術",
};

export const AXIS_ORDER: ReadonlyArray<Axis> = ["business", "team", "tech"];

export const CATEGORY_LABEL: Record<Category, string> = {
  philosophy: "哲学",
  analysis: "分析",
  requirements: "要件",
  design: "設計",
  implementation: "実装",
  operation: "運用",
};

export const CATEGORY_ORDER: ReadonlyArray<Category> = [
  "philosophy",
  "analysis",
  "requirements",
  "design",
  "implementation",
  "operation",
];

export const BOOKS: ReadonlyArray<Book> = [
  { no: 1, title: "アジャイルソフトウェア開発の奥義 第2版 オブジェクト指向開発の神髄と匠の技", authors: "ロバート・C・マーチン", year: 2008, publisher: "SBクリエイティブ", isbn: "978-4-89471-354-4", axis: "tech", category: "design" },
  { no: 2, title: "Clean Code　アジャイルソフトウェア達人の技", authors: "ロバート・C・マーチン", year: 2017, publisher: "アスキードワンゴ", isbn: "978-4-7561-4850-4", axis: "tech", category: "implementation" },
  { no: 3, title: "Clean Architecture　達人に学ぶソフトウェアの構造と設計", authors: "ロバート・C・マーチン", year: 2018, publisher: "アスキードワンゴ", isbn: "978-4-8019-0929-6", axis: "tech", category: "design" },
  { no: 4, title: "Clean Coder　プロフェッショナルプログラマへの道", authors: "ロバート・C・マーチン", year: 2018, publisher: "アスキードワンゴ", isbn: "978-4-7561-4620-3", axis: "tech", category: "philosophy" },
  { no: 5, title: "Clean Agile　基本に立ち戻れ", authors: "ロバート・C・マーチン", year: 2020, publisher: "アスキードワンゴ", isbn: "978-4-8019-1746-8", axis: "business", category: "philosophy" },
  { no: 6, title: "Clean Craftsmanship　規律、基準、倫理", authors: "ロバート・C・マーチン", year: 2022, publisher: "アスキードワンゴ", isbn: "978-4-8019-2491-6", axis: "tech", category: "philosophy" },
  { no: 7, title: "エクストリームプログラミング", authors: "ケント・ベック, シンシア・アンドレス, 角 征典（翻訳）", year: 2015, publisher: "オーム社", axis: "team", category: "philosophy" },
  { no: 8, title: "Tidy First? ―個人で実践する経験主義的ソフトウェア設計", authors: "ケント・ベック, 永瀬 美穂 他", year: 2024, publisher: "オライリー・ジャパン", axis: "tech", category: "design" },
  { no: 9, title: "実装パターン", authors: "ケント・ベック, 永田 渉, 長瀬 嘉秀 他", year: 2008, publisher: "ピアソンエデュケーション", isbn: "4894712873", axis: "tech", category: "implementation" },
  { no: 10, title: "新装版 リファクタリング―既存のコードを安全に改善する―", authors: "マーティン・ファウラー", year: 2014, publisher: "オーム社", isbn: "427405019X", axis: "tech", category: "implementation" },
  { no: 11, title: "リファクタリング(第2版): 既存のコードを安全に改善する", authors: "マーティン・ファウラー", year: 2019, publisher: "オーム社", isbn: "978-4-274-05026-0", axis: "tech", category: "implementation" },
  { no: 12, title: "エンタープライズアプリケーションアーキテクチャパターン", authors: "マーティン・ファウラー", year: 2005, publisher: "翔泳社", isbn: "4798105538", axis: "tech", category: "design" },
  { no: 13, title: "達人プログラマー(第2版): 熟達に向けたあなたの旅", authors: "アンドリュー・ハント, デイビッド・トーマス, 村上雅章（翻訳）", year: 2020, publisher: "オーム社", axis: "tech", category: "philosophy" },
  { no: 14, title: "現場で役立つシステム設計の原則 ~変更を楽で安全にするオブジェクト指向の実践技法", authors: "増田 亨", year: 2017, publisher: "技術評論社", axis: "tech", category: "design" },
  { no: 15, title: "ドメイン駆動設計をはじめよう ―ソフトウェアの実装と事業戦略を結びつける実践技法", authors: "ヴラッド・コノノフ, 増田 亨（翻訳）, 綿引 琢磨（翻訳）", year: 2024, publisher: "オライリー・ジャパン", axis: "tech", category: "design" },
  { no: 16, title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック", authors: "ダスティン・ボズウェル, トレバー・ファウチャー（原著）", year: 2012, publisher: "オライリージャパン", axis: "tech", category: "implementation" },
  { no: 17, title: "エリック・エヴァンスのドメイン駆動設計: ソフトウェアの核心にある複雑さに立ち向かう", authors: "エリック・エヴァンス, 和智 右桂, 牧野 祐子（翻訳）", year: 2011, publisher: "翔泳社", axis: "tech", category: "analysis" },
  { no: 18, title: "実践ドメイン駆動設計", authors: "ヴォーン・ヴァーノン（著）, 吉川 邦夫（翻訳）", year: 2015, publisher: "翔泳社", axis: "tech", category: "design" },
  { no: 19, title: "要件最適アーキテクチャ戦略", authors: "ヴォーン・ヴァーノン, トマス・ヤスクア 他", year: 2023, publisher: "翔泳社", axis: "tech", category: "requirements" },
  { no: 20, title: "ドメイン駆動設計入門 ボトムアップでわかる! ドメイン駆動設計の基本", authors: "成瀬 允宣", year: 2020, publisher: "翔泳社", axis: "tech", category: "implementation" },
  { no: 21, title: "テスト駆動開発", authors: "ケント・ベック, 和田卓人（翻訳）", year: 2017, publisher: "オーム社", axis: "tech", category: "implementation" },
  { no: 22, title: "データベース・リファクタリング", authors: "スコット・W・アンブラー, ピラモド・サダラージ, 梅澤 真史 他", year: 2008, publisher: "ピアソンエデュケーション", isbn: "4894715007", axis: "tech", category: "implementation" },
  { no: 23, title: "UNIXという考え方: その設計思想と哲学", authors: "マイク・ガンカーツ, 芳尾 桂（翻訳）", year: 2001, publisher: "オーム社", isbn: "4274064069", axis: "tech", category: "philosophy" },
  { no: 24, title: "レガシーコード改善ガイド: 保守開発のためのリファクタリング", authors: "マイケル・C・フェザーズ, 平澤 章（翻訳）", year: 2009, publisher: "翔泳社", axis: "tech", category: "analysis" },
  { no: 25, title: "レガシーコードからの脱却 ―ソフトウェアの寿命を延ばし価値を高める9つのプラクティス", authors: "デイビッド・スコット・バーンスタイン 他", year: 2019, publisher: "オライリージャパン", axis: "tech", category: "philosophy" },
  { no: 26, title: "プリンシプル オブ プログラミング3年目までに身につけたい一生役立つ101の原理原則", authors: "上田 勲", year: 2016, publisher: "秀和システム", axis: "tech", category: "philosophy" },
  { no: 27, title: "グラス片手にデータベース設計 販売管理システム編 第2版", authors: "梅田 弘之", year: 2016, publisher: "翔泳社", axis: "tech", category: "requirements" },
  { no: 28, title: "グラス片手にデータベース設計 会計システム編", authors: "梅田 弘之", year: 2005, publisher: "翔泳社", isbn: "4798109274", axis: "tech", category: "requirements" },
  { no: 29, title: "グラス片手にデータベース設計 生産管理システム編", authors: "梅田 弘之", year: 2009, publisher: "翔泳社", isbn: "4798119083", axis: "tech", category: "requirements" },
  { no: 30, title: "システム開発・刷新のための データモデル大全", authors: "渡辺 幸三", year: 2020, publisher: "日本実業出版社", axis: "tech", category: "requirements" },
  { no: 31, title: "アジャイルな見積りと計画づくり ~価値あるソフトウェアを育てる概念と技法~", authors: "マイク・コーン, 安井 力, 角谷 信太郎", year: 2009, publisher: "毎日コミュニケーションズ", isbn: "4839924023", axis: "team", category: "analysis" },
  { no: 32, title: "アジャイルサムライ−達人開発者への道−", authors: "ジョナサン・ラスムッソン 他", year: 2011, publisher: "オーム社", axis: "team", category: "analysis" },
  { no: 33, title: "SCRUM BOOT CAMP THE BOOK【増補改訂版】 スクラムチームではじめるアジャイル開発", authors: "西村 直人, 永瀬 美穂, 吉羽 龍太郎", year: 2020, publisher: "翔泳社", axis: "team", category: "analysis" },
  { no: 34, title: "ソフトウェアアーキテクチャの基礎 ―エンジニアリングに基づく体系的アプローチ", authors: "マーク・リチャーズ, ニール・フォード 他", year: 2022, publisher: "オライリージャパン", axis: "tech", category: "design" },
  { no: 35, title: "ソフトウェアアーキテクチャ・ハードパーツ ―分散アーキテクチャのためのトレードオフ分析", authors: "ニール・フォード, マーク・リチャーズ 他", year: 2022, publisher: "オライリー・ジャパン", axis: "tech", category: "design" },
  { no: 36, title: "Design It! ―プログラマーのためのアーキテクティング入門", authors: "マイケル・キーリング, 島田 浩二", year: 2019, publisher: "オライリージャパン", axis: "tech", category: "design" },
  { no: 37, title: "ITアーキテクト入門", authors: "臼杵 翔梧 他", year: 2024, publisher: "シーアンドアール研究所", axis: "tech", category: "philosophy" },
  { no: 38, title: "手を動かしてわかるクリーンアーキテクチャ　ヘキサゴナルアーキテクチャによるクリーンなアプリケーション開発", authors: "トム・ホムバーグス, 須田 智之", year: 2024, publisher: "インプレス", axis: "tech", category: "implementation" },
  { no: 39, title: "単体テストの考え方/使い方", authors: "ウラジミール・コリコフ, 須田 智之", year: 2022, publisher: "マイナビ出版", axis: "tech", category: "design" },
  { no: 40, title: "セキュア・バイ・デザイン 安全なソフトウェア設計", authors: "ダン・バーグ・ヨンソン 他", year: 2021, publisher: "マイナビ出版", axis: "tech", category: "design" },
  { no: 41, title: "アプリケーションアーキテクチャ設計パターン", authors: "三菱UFJインフォメーションテクノロジー株式会社 斉藤 賢哉", year: 2017, publisher: "技術評論社", axis: "tech", category: "implementation" },
  { no: 42, title: "Spring徹底入門 第2版 Spring FrameworkによるJavaアプリケーション開発", authors: "株式会社NTTデータ, 株式会社NTTデータグループ", year: 2024, publisher: "翔泳社", axis: "tech", category: "implementation" },
  { no: 43, title: "プロになるJava―仕事で必要なプログラミングの知識がゼロから身につく最高の指南書", authors: "きしだ なおき, 山本 裕介, 杉山 貴章", year: 2022, publisher: "技術評論社", axis: "tech", category: "implementation" },
  { no: 44, title: "Effective Java 第3版", authors: "ジョシュア・ブロック, 柴田 芳樹", year: 2018, publisher: "丸善出版", axis: "tech", category: "implementation" },
  { no: 45, title: "オブジェクト指向UIデザイン──使いやすいソフトウェアの原理", authors: "ソシオメディア株式会社, 上野 学, 藤井 幸多", year: 2020, publisher: "技術評論社", axis: "tech", category: "design" },
  { no: 46, title: "Reactハンズオンラーニング 第2版 ―Webアプリケーション開発のベストプラクティス", authors: "アレックス・バンクス, イヴ・ポーセロ, 宮崎 空", year: 2021, publisher: "オライリージャパン", axis: "tech", category: "implementation" },
  { no: 47, title: "詳解 Terraform 第3版 ―Infrastructure as Codeを実現する", authors: "イェフゲニー・ブリクマン, 松浦 隼人", year: 2023, publisher: "オライリー・ジャパン", axis: "tech", category: "operation" },
  { no: 48, title: "リーン・スタートアップ", authors: "エリック・リース, 伊藤 穣一, 井口 耕二", year: 2012, publisher: "日経BP", axis: "business", category: "analysis" },
  { no: 49, title: "Running Lean ―実践リーンスタートアップ", authors: "アッシュ・マウリャ, 渡辺 千賀, エリック・リース, 角 征典", year: 2012, publisher: "オライリージャパン", axis: "business", category: "analysis" },
  { no: 50, title: "ビジネスモデル・ジェネレーション: ビジネスモデル設計書", authors: "アレックス・オスターワルダー, イヴ・ピニュール, 小山 龍介", year: 2012, publisher: "翔泳社", isbn: "4798122971", axis: "business", category: "analysis" },
  { no: 51, title: "バリュー・プロポジション・デザイン: 顧客が欲しがる製品やサービスを創る", authors: "アレックス・オスターワルダー, 関 美和", year: 2015, publisher: "翔泳社", axis: "business", category: "analysis" },
  { no: 52, title: "企業参謀―戦略的思考とはなにか", authors: "大前 研一", year: 1999, publisher: "プレジデント社", isbn: "4833416948", axis: "business", category: "philosophy" },
  { no: 53, title: "経営参謀の発想法 (知力アップ講座)", authors: "後 正武", year: 1998, publisher: "プレジデント社", isbn: "4833416522", axis: "business", category: "philosophy" },
  { no: 54, title: "意思決定のための「分析の技術」", authors: "後 正武", year: 1998, publisher: "ダイヤモンド社", isbn: "978-4478372609", axis: "business", category: "analysis" },
  { no: 55, title: "わかる、使える「論理思考」の本 日本一わかりやすい授業、開講!", authors: "後 正武", year: 2010, publisher: "PHP研究所", axis: "business", category: "analysis" },
  { no: 56, title: "失敗学のすすめ", authors: "畑村 洋太郎", year: 2005, publisher: "講談社", isbn: "978-4062747592", axis: "business", category: "philosophy" },
  { no: 57, title: "数に強くなる", authors: "畑村 洋太郎", year: 2007, publisher: "岩波書店", isbn: "4004310636", axis: "business", category: "philosophy" },
  { no: 58, title: "イシューからはじめよ［改訂版］――知的生産の「シンプルな本質」", authors: "安宅 和人", year: 2024, publisher: "英治出版", axis: "business", category: "analysis" },
  { no: 59, title: "論理的に考える方法: 判断力がアップし本質への筋道が読める", authors: "小野田 博一", year: 1998, publisher: "日本実業出版社", isbn: "4534028075", axis: "business", category: "analysis" },
  { no: 60, title: "論理的に書く方法: 説得力ある文章表現が身につく", authors: "小野田 博一", year: 1997, publisher: "日本実業出版社", isbn: "4534026439", axis: "business", category: "analysis" },
  { no: 61, title: "論理的に話す方法: 説得力が倍増するワークブック", authors: "小野田 博一", year: 1996, publisher: "日本実業出版社", isbn: "4534024371", axis: "business", category: "analysis" },
  { no: 62, title: "新版 考える技術・書く技術 問題解決力を伸ばすピラミッド原則", authors: "バーバラ・ミント, 山崎 康司", year: 1999, publisher: "ダイヤモンド社", isbn: "978-4478490273", axis: "business", category: "analysis" },
  { no: 63, title: "実践テスト駆動開発: テストに導かれてオブジェクト指向ソフトウェアを育てる", authors: "スティーブ・フリーマン, ナット・プライス, 和智 右桂（翻訳）", year: 2012, publisher: "翔泳社", axis: "tech", category: "design" },
  { no: 64, title: "Head Firstデザインパターン 第2版 ―頭とからだで覚えるデザインパターンの基本", authors: "エリック・フリーマン, エリザベス・ロブソン, 佐藤 直生（監修）, 木下 哲也（翻訳）", year: 2022, publisher: "オライリージャパン", isbn: "4873119766", axis: "tech", category: "design" },
  { no: 65, title: "モノリスからマイクロサービスへ ―モノリスを進化させる実践移行ガイド", authors: "サム・ニューマン, 島田 浩二（翻訳）", year: 2020, publisher: "オライリージャパン", axis: "tech", category: "design" },
  { no: 66, title: "マイクロサービスアーキテクチャ 第2版", authors: "サム・ニューマン, 佐藤 直生（監修）, 木下 哲也（翻訳）", year: 2022, publisher: "オライリージャパン", axis: "tech", category: "design" },
  { no: 67, title: "マイクロサービスパターン[実践的システムデザインのためのコード解説]", authors: "クリス・リチャードソン, 樽澤広亨（監修）, 長尾高弘（翻訳）", year: 2020, publisher: "インプレス", axis: "tech", category: "implementation" },
  { no: 68, title: "JavaScriptで学ぶ関数型プログラミング", authors: "マイケル・フォーガス, 和田 祐一郎（翻訳）", year: 2014, publisher: "オライリージャパン", axis: "tech", category: "implementation" },
  { no: 69, title: "Javaによる関数型プログラミング ―Java 8ラムダ式とStream", authors: "ヴェンカット・スブラマニアム, 株式会社プログラミングシステム社（翻訳）", year: 2014, publisher: "オライリージャパン", axis: "tech", category: "implementation" },
  { no: 70, title: "Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions", authors: "Bobby Hohpe, Gregor Woolf", year: 2003, publisher: "Addison-Wesley Professional", axis: "tech", category: "design" },
  { no: 71, title: "Learning Domain-Driven Design: Aligning Software Architecture and Business Strategy", authors: "Vlad Khononov", year: 2021, publisher: "O'Reilly Media", axis: "tech", category: "design" },
  { no: 72, title: "Patterns, Principles, and Practices of Domain-Driven Design", authors: "Scott Millett, Nick Tune", year: 2015, publisher: "Wrox", axis: "tech", category: "design" },
  { no: 73, title: "Practical Domain-Driven Design in Enterprise Java: Using Jakarta EE, Eclipse MicroProfile, Spring Boot, and the Axon Framework", authors: "Vijay Nair", year: 2019, publisher: "Apress", isbn: "1484245423", axis: "tech", category: "implementation" },
  { no: 74, title: "Living Documentation: Continuous Knowledge Sharing by Design", authors: "Cyrille Martraire", year: 2019, publisher: "Addison-Wesley Professional", axis: "tech", category: "analysis" },
  { no: 75, title: "脳に収まるコードの書き方 ―複雑さを避け持続可能にするための経験則とテクニック", authors: "マーク・シーマン, 吉羽 龍太郎（翻訳）, 原田 騎郎（翻訳）", year: 2024, publisher: "オライリージャパン", axis: "tech", category: "philosophy" },
  { no: 76, title: "はじめてのGTD ストレスフリーの整理術", authors: "デビッド・アレン", year: 2008, publisher: "二見書房", isbn: "4576082116", axis: "team", category: "analysis" },
  { no: 77, title: "ひとつ上のGTD ストレスフリーの整理術 実践編――仕事というゲームと人生というビジネスに勝利する方法", authors: "デビッド・アレン", year: 2010, publisher: "二見書房", axis: "team", category: "analysis" },
];
