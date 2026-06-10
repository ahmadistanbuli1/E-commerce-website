import { describe, expect, it } from "vitest";
import { createCsrfToken, verifyCsrfToken } from "../../src/utils/csrf";

describe("CSRF token helpers", () => {
  it("creates verifiable signed tokens", () => {
    const token = createCsrfToken();
    expect(token.length).toBeGreaterThan(20);
    expect(verifyCsrfToken(token)).toBe(true);
  });

  it("rejects missing or invalid tokens", () => {
    expect(verifyCsrfToken(undefined)).toBe(false);
    expect(verifyCsrfToken("not-a-valid-token")).toBe(false);
  });
});
