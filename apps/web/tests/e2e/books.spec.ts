import { test, expect } from "@playwright/test";

test.describe("/books/ - Books 一覧", () => {
  test("ページが表示され、77 冊の総件数と 3 軸の集計が見える", async ({ page }) => {
    await page.goto("/books/");
    await expect(page.getByRole("heading", { level: 1, name: "Books" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /軸別の内訳/ })
    ).toBeVisible();
    await expect(page.getByText(/書籍 77 冊/)).toBeVisible();
  });

  test("カテゴリ別の内訳に 6 カテゴリ（哲学 / 分析 / 要件 / 設計 / 実装 / 運用）が表示される", async ({
    page,
  }) => {
    await page.goto("/books/");
    const summary = page.locator("section[aria-labelledby='category-summary-heading'] li");
    await expect(summary).toHaveCount(6);
    await expect(summary.first()).toContainText("哲学");
  });

  test("各カテゴリのセクションヘッダー（h2）が 6 つ存在する（カテゴリブロック）", async ({
    page,
  }) => {
    await page.goto("/books/");
    for (const label of ["哲学", "分析", "要件", "設計", "実装", "運用"]) {
      await expect(
        page.getByRole("heading", { level: 2, name: new RegExp(`^${label}\\s+\\d+ 冊`) })
      ).toBeVisible();
    }
  });

  test("カテゴリ要約のリンクから #category-design に遷移できる", async ({ page }) => {
    await page.goto("/books/");
    await page
      .locator("section[aria-labelledby='category-summary-heading']")
      .getByRole("link", { name: "設計" })
      .click();
    await expect(page).toHaveURL(/#category-design$/);
    await expect(page.locator("#category-design")).toBeVisible();
  });

  test("全件テーブルに 77 行のデータ（thead を除く）が含まれる", async ({ page }) => {
    await page.goto("/books/");
    const rows = page.getByTestId("books-table").locator("tbody tr");
    await expect(rows).toHaveCount(77);
  });
});
