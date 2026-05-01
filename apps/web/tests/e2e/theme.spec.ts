import { test, expect } from "@playwright/test";

test.describe("ダークモード切替（US-07）", () => {
  test("AC-07-1: 初回訪問時は prefers-color-scheme を尊重（dark の場合）", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html.dark")).toBeAttached();
    await context.close();
  });

  test("AC-07-1: 初回訪問時は prefers-color-scheme を尊重（light の場合）", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html.dark")).not.toBeAttached();
    await context.close();
  });

  test("AC-07-2: ヘッダーのトグルクリックで即時切替", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
    });
    await page.goto("/");
    await expect(page.locator("html.dark")).not.toBeAttached();

    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(page.locator("html.dark")).toBeAttached();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(page.locator("html.dark")).not.toBeAttached();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  test("AC-07-3: localStorage.theme に永続化、リロードしても保持", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html.dark")).not.toBeAttached();

    await page.locator("#theme-toggle").click();
    await expect(page.locator("html.dark")).toBeAttached();

    const stored = await page.evaluate(() => window.localStorage.getItem("theme"));
    expect(stored).toBe("dark");

    await page.reload();
    await expect(page.locator("html.dark")).toBeAttached();

    await context.close();
  });

  test("AC-07-5: View Transitions API 未対応ブラウザでも即時遷移する（視覚的不連続なし）", async ({
    page,
  }) => {
    // startViewTransition が undefined でも切替が動作することを確認する
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
      Object.defineProperty(document, "startViewTransition", {
        value: undefined,
        configurable: true,
      });
    });
    await page.goto("/");
    await expect(page.locator("html.dark")).not.toBeAttached();
    await page.locator("#theme-toggle").click();
    await expect(page.locator("html.dark")).toBeAttached();
  });
});
