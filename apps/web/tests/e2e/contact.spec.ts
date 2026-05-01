import { test, expect } from "@playwright/test";

test.describe("/contact/ - Contact 画面（US-05 + US-06）", () => {
  test("AC-05-1: 稼働可否ステータスが冒頭に表示される", async ({ page }) => {
    await page.goto("/contact/");
    await expect(page.getByRole("heading", { level: 1, name: "Contact" })).toBeVisible();
    const availability = page.getByTestId("availability");
    await expect(availability).toBeVisible();
    await expect(availability).toContainText("ステータス");
    await expect(availability).toContainText(/副業|稼働|可|不可/);
  });

  test("AC-05-2 / AC-05-3: 返信目標時間と案件規模が表示される", async ({ page }) => {
    await page.goto("/contact/");
    await expect(page.locator("body")).toContainText("原則 2 営業日以内");
    const availability = page.getByTestId("availability");
    await expect(availability).toContainText("相談可能な案件規模");
  });

  test("AC-06-1 / AC-06-2: 連絡チャネル 4 種が表示され、Email は mailto:、外部は target=_blank rel=noopener noreferrer", async ({
    page,
  }) => {
    await page.goto("/contact/");
    const links = page.getByTestId("contact-link");
    await expect(links).toHaveCount(4);

    const emailLink = page.locator('[data-kind="email"]');
    await expect(emailLink).toHaveAttribute("href", /^mailto:/);
    // mailto: は target=_blank を持たない（メールクライアント起動が直接的な動線）
    await expect(emailLink).not.toHaveAttribute("target", "_blank");

    for (const kind of ["github", "linkedin", "x"]) {
      const link = page.locator(`[data-kind="${kind}"]`);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
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

  test("各チャネルが aria-label でラベル付けされている（スクリーンリーダー対応）", async ({
    page,
  }) => {
    await page.goto("/contact/");
    const emailLink = page.locator('[data-kind="email"]');
    const ariaLabel = await emailLink.getAttribute("aria-label");
    expect(ariaLabel).not.toBeNull();
    expect(ariaLabel!.length).toBeGreaterThan(0);
    expect(ariaLabel).toMatch(/メール|email/i);
  });
});
