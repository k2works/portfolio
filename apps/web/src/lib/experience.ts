/**
 * since（西暦年）から現在年までの経験年数を計算する。
 * 1 年未満の場合は 1 を返す（凡例の整合性確保）。
 */
export function calculateExperienceYears(since: number, now: Date = new Date()): number {
  const currentYear = now.getFullYear();
  const years = currentYear - since;
  return years < 1 ? 1 : years;
}

/**
 * 凡例（Skill レベル ★1〜5 の意味付け）。
 * UI 設計 docs/design/ui_design.md の S04 セクションを参照。
 */
export const SKILL_LEVEL_LEGEND: Record<number, string> = {
  5: "メンター可能",
  4: "自走可能",
  3: "実務経験あり",
  2: "学習中",
  1: "入門",
};

/**
 * Skill カテゴリの表示順序。Practice は最後に置く（横並びリスト形式）。
 */
export const SKILL_CATEGORIES = ["Backend", "Frontend", "Infrastructure", "Practice"] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
