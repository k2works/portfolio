import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * axe-core via Playwright によるアクセシビリティ自動検証。
 * IT-3 タスク 3 の成果。WCAG 2.1 AA を主要タグで検証し、violations 0 を予算化。
 */

test.describe("アクセシビリティ（axe-core）", () => {
  test("ホーム（/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Works 一覧（/works/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/works/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Works 詳細（/works/[slug]/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/works/");
    const firstDetailLink = page
      .locator('[data-testid="work-card"]')
      .first()
      .getByRole("link", {
        name: /詳細を見る/,
      });
    await firstDetailLink.click();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Skills（/skills/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/skills/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("ダークモード適用時のホーム（/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });
    await page.goto("/");
    await expect(page.locator("html.dark")).toBeAttached();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("ダークモード適用時の Skills（/skills/）に WCAG 2.1 A / AA 違反がない", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });
    await page.goto("/skills/");
    await expect(page.locator("html.dark")).toBeAttached();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
