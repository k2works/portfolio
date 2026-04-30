import { describe, it, expect } from "vitest";

/**
 * IT-1 のスモークテスト。Vitest が起動することを確認するための最小例。
 * 実テストは IT-2 以降（Express ミドルウェア / ユーティリティ追加時）に追加する。
 */
describe("smoke", () => {
  it("Vitest 環境が動作する", () => {
    expect(1 + 1).toBe(2);
  });

  it("Node.js グローバルが利用できる", () => {
    expect(typeof process).toBe("object");
    expect(process.versions.node).toMatch(/^22\./);
  });
});
