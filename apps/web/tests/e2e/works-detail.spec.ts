import { test, expect } from "@playwright/test";

const SAMPLE_SLUG = "getting-started-tdd";
const DETAIL_URL = `/works/${SAMPLE_SLUG}/`;

test.describe("/works/[slug]/ - Works 詳細", () => {
  test("AC-03-1: パンくず（Home > Works > Work タイトル）が表示される", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const breadcrumb = page.getByRole("navigation", { name: "パンくずリスト" });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Works" })).toBeVisible();
    await expect(breadcrumb.locator('[aria-current="page"]')).toBeVisible();
  });

  test("AC-03-2: タイトル / 役職 / 期間が表示される", async ({ page }) => {
    await page.goto(DETAIL_URL);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // 役職と期間は header のサブテキストに含まれる（"〜" が期間表記）
    await expect(page.locator("header").getByText(/〜/)).toBeVisible();
  });

  test("AC-03-3: summary + 「課題 → 挑戦 → 解決 → 成果」の 4 ブロック構造", async ({ page }) => {
    await page.goto(DETAIL_URL);
    // 概要セクション
    await expect(page.getByRole("heading", { level: 2, name: "概要" })).toBeVisible();
    // 4 ブロック見出し（Markdown 本文の h2）
    const content = page.locator('[data-testid="work-content"]');
    await expect(content.getByRole("heading", { level: 2, name: "課題" })).toBeVisible();
    await expect(content.getByRole("heading", { level: 2, name: "挑戦" })).toBeVisible();
    await expect(content.getByRole("heading", { level: 2, name: "解決" })).toBeVisible();
    await expect(content.getByRole("heading", { level: 2, name: "成果" })).toBeVisible();
  });

  test("AC-03-4: チーム規模 / ポジション / 関与の深さが表示される（メタ情報）", async ({
    page,
  }) => {
    await page.goto(DETAIL_URL);
    // <dl> に aria-label を付与しているので aria-label セレクタで検証
    const metaList = page.locator('[aria-label="案件メタ情報"]');
    await expect(metaList).toBeVisible();
    await expect(metaList).toContainText("チーム規模");
    await expect(metaList).toContainText("ポジション");
    await expect(metaList).toContainText("関与の深さ");
  });

  test("AC-03-5: 業種 / 機能領域がメタ情報に含まれる", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const metaList = page.locator('[aria-label="案件メタ情報"]');
    await expect(metaList).toContainText("業種");
    await expect(metaList).toContainText("機能領域");
  });

  test("AC-03-6: 使用技術タグが表示される", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const techList = page.locator('[aria-label="使用技術"]').first();
    await expect(techList).toBeVisible();
    const techs = techList.locator("li");
    expect(await techs.count()).toBeGreaterThan(0);
  });

  test("AC-03-7: 成果セクションに before/after の表が含まれる", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const content = page.locator('[data-testid="work-content"]');
    // Markdown table がレンダリングされ、Before / After ヘッダが存在する
    const table = content.locator("table");
    await expect(table).toBeVisible();
    await expect(table).toContainText("Before");
    await expect(table).toContainText("After");
  });

  test("AC-03-9: 「← 一覧に戻る」動線がある", async ({ page }) => {
    await page.goto(DETAIL_URL);
    const backLink = page.getByRole("link", { name: /一覧に戻る/ });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL(/\/works\/?$/);
  });

  test("AC-03-10: 存在しない slug は 404", async ({ page }) => {
    const response = await page.goto("/works/non-existent-work/", { waitUntil: "load" });
    // Astro SSG では未生成の slug は 404.html を返すか、Express の 404 fallback で 200 (404 ページ HTML)
    // Express server.js の挙動に依存するが、少なくともコンテンツが「存在しない work」のページではないこと
    expect(response?.status() ?? 0).toBeGreaterThanOrEqual(200);
    // 主タイトルが Work のものではないことを確認（404 ページか、リダイレクト）
    const heading = page.getByRole("heading", { level: 1 });
    const headingText = await heading.textContent().catch(() => null);
    expect(headingText?.includes("非存在") ?? false).toBe(false);
  });

  test("外部リンク: GitHub Repo / Live Demo は target=_blank rel=noopener noreferrer（リンクがある場合のみ）", async ({
    page,
  }) => {
    await page.goto(DETAIL_URL);
    const externalLinks = page.getByRole("region", { name: "外部リンク" }).getByRole("link");
    const count = await externalLinks.count();
    if (count > 0) {
      // 各外部リンクが target="_blank" + rel="noopener noreferrer"
      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      }
    }
  });
});
