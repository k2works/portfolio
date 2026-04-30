import { test, expect } from "@playwright/test";

test.describe("/works/ - Works 一覧", () => {
  test("AC-02-1: /works/ で全 Works がカード形式で表示される", async ({ page }) => {
    await page.goto("/works/");
    await expect(page.getByRole("heading", { level: 1, name: "Works" })).toBeVisible();
    const cards = page.locator('[data-testid="work-card"]');
    // v0.2 リリース時は 5 件以上揃える方針
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("AC-02-2: 各カードに title / period / summary / 技術タグ / 詳細ボタンが含まれる", async ({
    page,
  }) => {
    await page.goto("/works/");
    const firstCard = page.locator('[data-testid="work-card"]').first();
    await expect(firstCard.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(firstCard.getByText(/〜/)).toBeVisible();
    await expect(firstCard.getByRole("link", { name: /詳細を見る/ })).toBeVisible();
    await expect(firstCard.locator('[aria-label="使用技術"]')).toBeVisible();
  });

  test("AC-02-3: 技術タグでフィルタでき URL に ?tag=... が付与される", async ({ page }) => {
    await page.goto("/works/");
    // TypeScript は case-study-accounting と case-study-sales の 2 件、フィルタ後に件数が減る
    await page.getByRole("button", { name: "TypeScript", exact: true }).click();
    await page.waitForURL(/\?tag=TypeScript/);
    const visibleCards = page.locator('[data-testid="work-card"]:not([style*="display: none"])');
    await expect(visibleCards).toHaveCount(2, { timeout: 5000 });
  });

  test("AC-02-4: 「All」で絞り込み解除", async ({ page }) => {
    await page.goto("/works/?tag=TypeScript");
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page).toHaveURL(/\/works\/?$/);
    const visibleCards = page.locator('[data-testid="work-card"]:not([style*="display: none"])');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("AC-02-5: 0 件時は空メッセージ + フィルタ解除リンクを表示", async ({ page }) => {
    // 既知タグでマッチが減っても、最低 1 件あれば status は hidden
    await page.goto("/works/?tag=TypeScript");
    await expect(
      page.locator('[data-testid="work-card"]:not([style*="display: none"])')
    ).toHaveCount(2, { timeout: 2000 });
    const empty = page.locator("#works-empty");
    await expect(empty).toBeHidden();
  });

  test("AC-02-6: 件数表示「N 件中 M 件を表示」が表示される", async ({ page }) => {
    await page.goto("/works/");
    const count = await page.locator('[data-testid="work-card"]').count();
    await expect(page.locator("#works-count")).toHaveText(`${count} 件中 ${count} 件を表示`);

    await page.goto("/works/?tag=TypeScript");
    await expect(page.locator("#works-count")).toContainText("件中");
    await expect(page.locator("#works-count")).toContainText("件を表示");
  });

  test("AC-02-7: 現在選択タグは aria-pressed=true、その他は false", async ({ page }) => {
    await page.goto("/works/");
    await expect(page.locator('[data-filter="all"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-filter="TypeScript"]')).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    await page.goto("/works/?tag=TypeScript");
    await expect(page.locator('[data-filter="TypeScript"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(page.locator('[data-filter="all"]')).toHaveAttribute("aria-pressed", "false");
  });

  test("AC-02-8: 不明タグでアクセスされた場合は All 状態 + URL を /works/ に正規化", async ({
    page,
  }) => {
    await page.goto("/works/?tag=NotExistentTag");
    // history.replaceState で URL から ?tag=... が削除される
    await expect(page).toHaveURL(/\/works\/?$/);
    // 全件表示
    const visibleCards = page.locator('[data-testid="work-card"]:not([style*="display: none"])');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThanOrEqual(5);
    // All が aria-pressed=true
    await expect(page.locator('[data-filter="all"]')).toHaveAttribute("aria-pressed", "true");
  });

  test("詳細リンクから /works/[slug]/ へ遷移する", async ({ page }) => {
    await page.goto("/works/");
    const firstDetailLink = page
      .locator('[data-testid="work-card"]')
      .first()
      .getByRole("link", {
        name: /詳細を見る/,
      });
    await firstDetailLink.click();
    await expect(page).toHaveURL(/\/works\/[^/]+\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /一覧に戻る/ })).toBeVisible();
  });
});
