import { test, expect } from "@playwright/test";

/**
 * IT-1 の E2E スモークテスト。dev server が起動してホームに `<h1>` が表示されることのみ確認。
 * E01〜E12 のシナリオは IT-2 以降で本格化。
 */
test("ホームに h1 が表示される", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
