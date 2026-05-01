/**
 * Contact 画面（S05）のデータ定義。
 * 稼働可否（availability）+ 返信目標 + 案件規模 + 連絡チャネル 4 種。
 *
 * 構造は ui_design.md S05 salt 図に従い「現在の状況 → 案内 → リンク」の順で
 * 表示すること。AC-05-1〜3 / AC-06-1〜3（user_story.md US-05 / US-06）に対応。
 */

export interface AvailabilityInfo {
  /** 稼働可否ステータス（冒頭に表示） */
  readonly status: string;
  /** 相談可能な案件規模（任意） */
  readonly scope?: string;
  /** 返信目標時間 */
  readonly responseTime: string;
}

export type ContactChannelKind = "email" | "github" | "linkedin" | "x";

export interface ContactChannel {
  readonly kind: ContactChannelKind;
  readonly label: string;
  readonly href: string;
  /** タッチターゲット用のアクセシブルなラベル（aria-label に使用） */
  readonly ariaLabel: string;
}

export const AVAILABILITY: AvailabilityInfo = {
  status: "副業のみ可（週 2 日 / 完全リモート）",
  scope: "50 万円〜 / 月、3 ヶ月〜",
  responseTime: "原則 2 営業日以内",
};

export const CONTACT_CHANNELS: ReadonlyArray<ContactChannel> = [
  {
    kind: "email",
    label: "Email",
    href: "mailto:contact@example.com",
    ariaLabel: "メールで連絡する（メールクライアントが起動します）",
  },
  {
    kind: "github",
    label: "GitHub",
    href: "https://github.com/k2works",
    ariaLabel: "GitHub のプロフィールへ移動（外部サイト）",
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    ariaLabel: "LinkedIn のプロフィールへ移動（外部サイト）",
  },
  {
    kind: "x",
    label: "X",
    href: "https://x.com/",
    ariaLabel: "X（旧 Twitter）のプロフィールへ移動（外部サイト）",
  },
];
