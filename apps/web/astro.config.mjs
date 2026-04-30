// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://portfolio.example.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [sitemap()],
  vite: {
    // @ts-expect-error Astro 同梱 Vite と Tailwind v4 の型差異（IT-2 以降で再評価）
    plugins: [tailwindcss()],
  },
});
