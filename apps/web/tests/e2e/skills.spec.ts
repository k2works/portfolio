import { test, expect } from "@playwright/test";

test.describe("/skills/ - Skills 一覧", () => {
  test("AC-04-1: Backend / Frontend / Infrastructure / Practice の各カテゴリで一覧表示", async ({
    page,
  }) => {
    await page.goto("/skills/");
    await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Backend" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Frontend" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Infrastructure" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Practice" })).toBeVisible();
  });

  test("AC-04-2: 各 Skill に経験年数（since から自動計算）+ 状態を表示", async ({ page }) => {
    await page.goto("/skills/");
    const cards = page.getByTestId("skill-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    const first = cards.first();
    await expect(first).toContainText(/\d+ 年（since \d{4}）/);
    await expect(first).toContainText(/現役|過去/);
  });

  test("AC-04-3: 凡例（★1〜5）が画面に明示されている", async ({ page }) => {
    await page.goto("/skills/");
    await expect(page.getByRole("heading", { level: 2, name: "凡例" })).toBeVisible();
    const legendList = page.locator("section[aria-labelledby='legend-heading'] li");
    await expect(legendList).toHaveCount(5);
    await expect(legendList.first()).toContainText("メンター可能");
  });

  test("AC-04-4: 関連 Work へのリンク（Work 逆参照）が 1 つ以上表示", async ({ page }) => {
    await page.goto("/skills/");
    const workLinks = page
      .getByTestId("skill-card")
      .locator("a[href^='/works/']");
    const count = await workLinks.count();
    expect(count).toBeGreaterThan(0);
    const href = await workLinks.first().getAttribute("href");
    expect(href).toMatch(/^\/works\/[\w-]+\/$/);
  });

  test("AC-04-5: ハッシュ URL（/skills/#java-spring）で該当 Skill にスクロール", async ({
    page,
  }) => {
    await page.goto("/skills/#java-spring");
    const target = page.locator("#java-spring");
    await expect(target).toBeVisible();
    await expect(target).toContainText("Java / Spring");
  });
});
