import { test, expect } from "@playwright/test";

/**
 * E01 ホーム表示シナリオ + 横断的な基本検証。
 * UI 設計（docs/design/ui_design.md）の S01 に対応。
 * IT-2 ではホームのみ。E02〜E12 は IT-3 以降で順次追加。
 */

test.describe("E01: ホーム表示", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ページタイトルに氏名と役職が含まれる", async ({ page }) => {
    await expect(page).toHaveTitle(/k2works/);
    await expect(page).toHaveTitle(/Software Engineer/);
  });

  test("h1 が氏名を表示する", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/k2works/);
  });

  test("得意領域タグが 5 つ以上表示される", async ({ page }) => {
    const specialties = page.getByRole("list", { name: "得意領域" }).getByRole("listitem");
    const count = await specialties.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("Featured Works のカードが 3 件表示される", async ({ page }) => {
    const cards = page.locator('[data-testid="work-card"]');
    await expect(cards).toHaveCount(3);
  });

  test("Skills Highlights が 3 カテゴリ表示される", async ({ page }) => {
    const skills = page.getByRole("heading", { level: 3 }).filter({
      hasText: /Backend|Frontend|Infrastructure/,
    });
    await expect(skills).toHaveCount(3);
  });

  test("主要 CTA（Works / Contact）が存在する", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Works を見る/ })).toBeVisible();
    // ヘッダーナビと hero の両方に "Contact" リンクがあるため、最低 1 件以上を確認
    const contactLinks = page.getByRole("link", { name: "Contact", exact: true });
    const count = await contactLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("ナビゲーション・アクセシビリティ基本", () => {
  test("ヘッダーナビの Home に aria-current が付与される", async ({ page }) => {
    await page.goto("/");
    const homeNav = page
      .getByRole("navigation", { name: "メインナビゲーション" })
      .getByRole("link", { name: "Home", exact: true });
    await expect(homeNav).toHaveAttribute("aria-current", "page");
  });

  test("外部リンクが target=_blank と rel=noopener noreferrer を持つ", async ({ page }) => {
    await page.goto("/");
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  test("スキップリンクが存在する", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: "メインコンテンツへ移動" });
    await expect(skip).toBeAttached();
  });

  test("ランドマーク（header / main / footer）が存在する", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});

test.describe("OGP / SEO メタタグ", () => {
  test("og:title / og:description / og:type が出力される", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
    const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
    expect(ogTitle).toMatch(/k2works/);
    expect(ogDesc).toBeTruthy();
    expect(ogType).toBe("website");
  });

  test("Twitter Card が summary_large_image", async ({ page }) => {
    await page.goto("/");
    const card = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    expect(card).toBe("summary_large_image");
  });
});
