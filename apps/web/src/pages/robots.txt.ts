import type { APIRoute } from "astro";

/**
 * /robots.txt を環境別に出力する Astro endpoint。
 *
 * - 通常: `Allow: /` + `Sitemap: <site>/sitemap-index.xml`
 * - PUBLIC_ROBOTS_DISALLOW=true（staging / development）: `Disallow: /`
 *
 * 詳細は docs/design/non_functional.md / ADR-0003 / docs/operation/heroku_staging_setup.md。
 */
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const disallow = import.meta.env["PUBLIC_ROBOTS_DISALLOW"] === "true";

  const fallbackOrigin = "https://portfolio.example.com";
  const sitemapURL = site
    ? new URL("sitemap-index.xml", site).toString()
    : `${fallbackOrigin}/sitemap-index.xml`;

  const lines = disallow
    ? ["User-agent: *", "Disallow: /"]
    : ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapURL}`];

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
