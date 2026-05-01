import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * axe-core via Playwright によるアクセシビリティ自動検証。
 * IT-3 タスク 3 の成果。WCAG 2.1 AA を主要タグで検証し、violations 0 を予算化。
 *
 * 注: ホーム（/）の ALU 公式埋め込み iframe（data-testid="catch-embed"）は
 * 第三者所有コンテンツのため自前で a11y を担保できない。axe-core の検査対象から除外する。
 * （iframe 内の <img alt> 欠落・<a> アクセシブル名欠落は ALU 側の責務）
 */

test.describe("アクセシビリティ（axe-core）", () => {
  test("ホーム（/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude('iframe[data-testid="catch-embed"]')
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

  test("Books（/books/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/books/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Contact（/contact/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.goto("/contact/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("ダークモード適用時の Contact（/contact/）に WCAG 2.1 A / AA 違反がない", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/contact/");
    await expect(page.locator("html.dark")).toBeAttached();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
    await context.close();
  });

  test("ダークモード適用時のホーム（/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });
    await page.goto("/");
    await expect(page.locator("html.dark")).toBeAttached();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude('iframe[data-testid="catch-embed"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("ダークモード適用時の Skills（/skills/）に WCAG 2.1 A / AA 違反がない", async ({ page }) => {
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
