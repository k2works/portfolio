import { test, expect } from "@playwright/test";

test.describe("/contact/ - Contact 画面（US-05 + US-06）", () => {
  test("AC-05-1: 稼働可否ステータスが冒頭に表示される", async ({ page }) => {
    await page.goto("/contact/");
    await expect(page.getByRole("heading", { level: 1, name: "Contact" })).toBeVisible();
    const availability = page.getByTestId("availability");
    await expect(availability).toBeVisible();
    await expect(availability).toContainText("ステータス");
    // v1.0: 受注停止中（採用・取材・交流のみ受付）の状態を許容
    await expect(availability).toContainText(/受注|稼働|可|不可|停止/);
  });

  test("AC-05-2: 返信目標時間が表示される", async ({ page }) => {
    await page.goto("/contact/");
    await expect(page.locator("body")).toContainText("原則 2 営業日以内");
  });

  test("AC-06-1 / AC-06-2: 連絡チャネル（X のみ）が target=_blank rel=noopener noreferrer で出力される", async ({
    page,
  }) => {
    await page.goto("/contact/");
    const links = page.getByTestId("contact-link");
    // v1.0: 受注停止に伴い X のみに集約
    await expect(links).toHaveCount(1);

    const xLink = page.locator('[data-kind="x"]');
    await expect(xLink).toHaveAttribute("target", "_blank");
    await expect(xLink).toHaveAttribute("rel", "noopener noreferrer");
    await expect(xLink).toHaveAttribute("href", /^https:\/\/x\.com\//);
  });

  test("AC-06-3: 全リンクは 44×44 px 以上のタッチターゲットを満たす（WCAG 2.5.5）", async ({
    page,
  }) => {
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

  test("X チャネルが aria-label でラベル付けされている（スクリーンリーダー対応）", async ({
    page,
  }) => {
    await page.goto("/contact/");
    const xLink = page.locator('[data-kind="x"]');
    const ariaLabel = await xLink.getAttribute("aria-label");
    expect(ariaLabel).not.toBeNull();
    expect(ariaLabel!.length).toBeGreaterThan(0);
    expect(ariaLabel).toMatch(/X|Twitter/i);
  });
});
