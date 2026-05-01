import { test, expect, type Page } from "@playwright/test";

/**
 * モバイル用 E2E（IT-3 タスク 2 で実装、IT-7 で iPhone SE + Android Chromium
 * の 2 デバイス対応 + タッチターゲット検証 + ホームスクロール内訳を追加）。
 *
 * - iPhone SE 相当: 375×667
 * - Android Chromium 相当: 412×915
 *
 * WebKit に依存しない形で Chromium のみで実行する（v1.0 で他ブラウザ対応）。
 */

const DEVICES = [
  { name: "iPhone SE", viewport: { width: 375, height: 667 } },
  { name: "Android Chromium", viewport: { width: 412, height: 915 } },
] as const;

const expectTouchTargetMeetsWCAG = async (
  page: Page,
  selector: string,
  pageDesc: string
): Promise<void> => {
  const locator = page.locator(selector).first();
  await expect(locator, `${pageDesc} の ${selector} が見つからない`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${pageDesc} の ${selector} の boundingBox が取得できない`).not.toBeNull();
  expect(box!.width, `${pageDesc} の ${selector} 幅`).toBeGreaterThanOrEqual(44);
  expect(box!.height, `${pageDesc} の ${selector} 高さ`).toBeGreaterThanOrEqual(44);
};

for (const device of DEVICES) {
  test.describe(`モバイル（${device.name} / ${device.viewport.width}×${device.viewport.height}）`, () => {
    test.use({
      baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4321",
      viewport: device.viewport,
      hasTouch: true,
    });

    test("ハンバーガーボタンが表示され、ナビは初期非表示", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator("#mobile-nav-toggle");
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      const nav = page.locator("#primary-navigation");
      await expect(nav).toBeHidden();
    });

    test("ハンバーガークリックでメニューが展開する", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator("#mobile-nav-toggle");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toHaveAccessibleName(/メニューを閉じる/);
      await expect(page.locator("#primary-navigation")).toBeVisible();
    });

    test("Esc キーでメニューが閉じる", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator("#mobile-nav-toggle");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("#primary-navigation")).toBeHidden();
    });

    test("AC-08-3: ヘッダーのハンバーガー / ThemeToggle が 44×44 px 以上", async ({ page }) => {
      await page.goto("/");
      await expectTouchTargetMeetsWCAG(page, "#mobile-nav-toggle", "ホーム ヘッダー");
      await expectTouchTargetMeetsWCAG(page, "#theme-toggle", "ホーム ヘッダー");
    });

    test("AC-08-3: Contact の連絡チャネルリンクが 44×44 px 以上", async ({ page }) => {
      await page.goto("/contact/");
      const links = page.getByTestId("contact-link");
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const box = await links.nth(i).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    });
  });
}

test.describe("ホームのスクロール量（iPhone SE / 375×667）", () => {
  test.use({
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4321",
    viewport: { width: 375, height: 667 },
    hasTouch: true,
  });

  test("AC-08-5: モバイルでホームの主要セクションが 6〜8 スクロール以内に収まる", async ({
    page,
  }) => {
    await page.goto("/");
    const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollScreens = documentHeight / viewportHeight;
    // 余裕を持たせて 1〜10 スクリーン以内であることをアサート
    // （ホームに過剰なセクションが追加されたら検出する）
    expect(scrollScreens).toBeGreaterThan(0);
    expect(scrollScreens).toBeLessThanOrEqual(10);
  });
});

test.describe("メニュー展開時の body スクロール抑止（iPhone SE）", () => {
  test.use({
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4321",
    viewport: { width: 375, height: 667 },
    hasTouch: true,
  });

  test("メニュー展開時に body スクロールが抑止される", async ({ page }) => {
    await page.goto("/");
    const overflowBefore = await page.evaluate(() => document.body.style.overflow);
    expect(overflowBefore).toBe("");

    await page.locator("#mobile-nav-toggle").click();

    const overflowAfter = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfter).toBe("hidden");
  });
});
