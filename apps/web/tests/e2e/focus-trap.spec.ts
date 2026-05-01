import { test, expect } from "@playwright/test";

/**
 * AC-10-5: ハンバーガーメニュー展開時はフォーカストラップ + Esc で閉じる
 * + body スクロール抑止（US-10 / IT-8）。
 *
 * モバイルビューポート（iPhone SE 375×667）で検証。
 */

test.use({
  baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4321",
  viewport: { width: 375, height: 667 },
  hasTouch: true,
});

test.describe("AC-10-5: フォーカストラップ（モバイルメニュー）", () => {
  test("メニュー展開時、最後の要素から Tab → 最初の要素に戻る", async ({ page }) => {
    await page.goto("/");
    await page.locator("#mobile-nav-toggle").click();
    await expect(page.locator("#mobile-nav-toggle")).toHaveAttribute("aria-expanded", "true");

    // メニュー内の最後のフォーカス可能要素を取得し、フォーカス
    const focusables = page.locator(
      '#primary-navigation a[href], #primary-navigation button, #primary-navigation [tabindex]:not([tabindex="-1"])'
    );
    const count = await focusables.count();
    expect(count).toBeGreaterThan(0);

    const lastLink = focusables.last();
    await lastLink.focus();

    // Tab で次にいくと、最初の要素に戻る（フォーカストラップ）
    await page.keyboard.press("Tab");

    const firstHref = await focusables.first().getAttribute("href");
    const focusedHref = await page.evaluate(
      () => (document.activeElement as HTMLAnchorElement | null)?.getAttribute("href") ?? null
    );
    expect(focusedHref).toBe(firstHref);
  });

  test("メニュー展開時、最初の要素から Shift+Tab → 最後の要素にループする", async ({ page }) => {
    await page.goto("/");
    await page.locator("#mobile-nav-toggle").click();
    await expect(page.locator("#mobile-nav-toggle")).toHaveAttribute("aria-expanded", "true");

    const focusables = page.locator(
      '#primary-navigation a[href], #primary-navigation button, #primary-navigation [tabindex]:not([tabindex="-1"])'
    );
    const firstLink = focusables.first();
    await firstLink.focus();

    await page.keyboard.press("Shift+Tab");

    const lastHref = await focusables.last().getAttribute("href");
    const focusedHref = await page.evaluate(
      () => (document.activeElement as HTMLAnchorElement | null)?.getAttribute("href") ?? null
    );
    expect(focusedHref).toBe(lastHref);
  });

  test("メニュー展開時、Esc で閉じてフォーカスがハンバーガートグルに戻る", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("#mobile-nav-toggle");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // メニュー内のリンクにフォーカス
    const firstLink = page.locator("#primary-navigation a[href]").first();
    await firstLink.focus();

    await page.keyboard.press("Escape");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    // フォーカスがハンバーガートグルに戻る
    const focusedId = await page.evaluate(() => document.activeElement?.id ?? null);
    expect(focusedId).toBe("mobile-nav-toggle");
  });
});
