import type { Config } from "tailwindcss";

/**
 * Tailwind CSS 4 設定（IT-2 から適用）。
 * トークンは src/styles/global.css の CSS カスタムプロパティと連動させる。
 */
export default {
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        accent: "var(--color-accent)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ["system-ui", "Segoe UI", "Hiragino Sans", "sans-serif"],
      },
      maxWidth: {
        prose: "64rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
