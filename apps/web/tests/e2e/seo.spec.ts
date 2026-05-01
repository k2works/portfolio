import { test, expect } from "@playwright/test";

/**
 * SEO / OGP メタタグの E2E（IT-9 / US-12）。
 * AC-12-1: 全画面で OGP メタタグが出力される
 * AC-12-2: OGP 画像が 1200×630（og:image:width / og:image:height）で 200 を返す
 * AC-12-3: Works 詳細で og:title が Work タイトル
 * AC-12-4: Twitter Card が summary_large_image
 *
 * 注: 画像形式は IT-9 では /og.svg（image/svg+xml）。
 * AC-12-2 の「image/png または image/jpeg」化は v1.1 以降で対応予定。
 */

const PAGES_TO_VERIFY = [
  "/",
  "/works/",
  "/works/sample-1/",
  "/skills/",
  "/books/",
  "/contact/",
] as const;

test.describe("AC-12-1 / AC-12-4: OGP メタタグが全画面で出力される", () => {
  for (const url of PAGES_TO_VERIFY) {
    test(`${url} で og:title / og:description / og:url / og:image が出力される`, async ({
      page,
    }) => {
      await page.goto(url);

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");

      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogUrl).toBeTruthy();
      expect(ogImage).toBeTruthy();
      expect(ogType).toBe("website");
      expect(twitterCard).toBe("summary_large_image");
    });
  }
});

test.describe("AC-12-2: OGP 画像が 1200×630 + 200 を返す", () => {
  test("og:image:width / og:image:height が 1200 / 630", async ({ page }) => {
    await page.goto("/");
    const width = await page.locator('meta[property="og:image:width"]').getAttribute("content");
    const height = await page.locator('meta[property="og:image:height"]').getAttribute("content");
    expect(width).toBe("1200");
    expect(height).toBe("630");
  });

  test("og:image URL が 200 を返す", async ({ page, request }) => {
    await page.goto("/");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toBeTruthy();
    const url = new URL(ogImage!, page.url()).toString();
    const response = await request.get(url);
    expect(response.status()).toBe(200);
  });
});

test.describe("AC-12-3: Works 詳細で og:title が Work タイトルを含む", () => {
  test("/works/sample-1/ の og:title に Work タイトルが含まれる", async ({ page }) => {
    await page.goto("/works/sample-1/");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const h1 = await page.getByRole("heading", { level: 1 }).textContent();
    expect(ogTitle).toBeTruthy();
    expect(h1).toBeTruthy();
    // og:title は ページ title プロパティ経由で出力される。Work タイトル文字列を含むはず。
    expect(ogTitle?.toLowerCase()).toContain((h1 ?? "").trim().split("|")[0]!.trim().toLowerCase());
  });
});
