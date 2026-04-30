import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.spec.{ts,js}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,js,astro}", "server.js"],
      exclude: ["src/pages/**", "src/env.d.ts"],
    },
    globals: false,
  },
});
