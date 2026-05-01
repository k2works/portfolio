import { test, expect } from "@playwright/test";

/**
 * Tech Notes 同居の E2E（IT-9 / US-11）。
 * AC-11-1: ヘッダーナビに「Tech Notes」（「Docs」ではない）と「↗」アイコン付き
 * AC-11-2: クリックで /docs/ に同一タブ遷移
 *
 * AC-11-3 / AC-11-4 / AC-11-5（ガイダンスバナー / 戻り動線 / 配色共通化）は
 * MkDocs 側の実装で、Astro テストでは `/docs/` の到達は MkDocs ビルド成果物に
 * 依存するため、ヘッダーナビのリンク存在 + 同一タブ遷移属性のみ検証する。
 * 統合検証は GitHub Actions の Deploy + 目視 / 別途手動検証で行う。
 */

test.describe("AC-11-1: ヘッダーナビに「Tech Notes ↗」が表示される", () => {
  test("「Tech Notes ↗」リンクがヘッダーに存在する（「Docs」ではない）", async ({ page }) => {
    await page.goto("/");
    const techNotesLink = page
      .getByRole("navigation", { name: "メインナビゲーション" })
      .getByRole("link", { name: /Tech Notes/ });
    await expect(techNotesLink).toBeAttached();

    const text = await techNotesLink.textContent();
    expect(text).toContain("Tech Notes");
    // 「Docs」単体ではない（Tech Notes が必須）
    expect(text).not.toMatch(/^Docs$/);
    // 矢印アイコンが含まれる（↗ または 同等の表記）
    expect(text).toMatch(/↗|↘|→/);
  });
});

test.describe("AC-11-2: Tech Notes クリックで /docs/ へ同一タブ遷移", () => {
  test("Tech Notes リンクが href=/docs/ で target=_blank ではない", async ({ page }) => {
    await page.goto("/");
    const techNotesLink = page
      .getByRole("navigation", { name: "メインナビゲーション" })
      .getByRole("link", { name: /Tech Notes/ });
    await expect(techNotesLink).toBeAttached();

    const href = await techNotesLink.getAttribute("href");
    expect(href).toBe("/docs/");

    const target = await techNotesLink.getAttribute("target");
    // 同一タブ遷移なので target=_blank ではない
    expect(target).not.toBe("_blank");
  });

  test("複数ページから Tech Notes へ遷移できる（リンク href を 6 ページで確認）", async ({
    page,
  }) => {
    const pages = ["/", "/works/", "/skills/", "/books/", "/contact/", "/works/sample-1/"];
    for (const url of pages) {
      await page.goto(url);
      const link = page
        .getByRole("navigation", { name: "メインナビゲーション" })
        .getByRole("link", { name: /Tech Notes/ });
      const href = await link.getAttribute("href");
      expect(href, `${url} で Tech Notes リンクが /docs/ ではない`).toBe("/docs/");
    }
  });
});
