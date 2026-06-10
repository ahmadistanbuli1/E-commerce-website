import { describe, expect, it } from "vitest";
import { csrfTokensMatch, generateCsrfToken } from "../../src/utils/csrf";

describe("CSRF token helpers", () => {
  it("generates unique tokens", () => {
    const a = generateCsrfToken();
    const b = generateCsrfToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(20);
  });

  it("matches identical cookie and header tokens", () => {
    const token = generateCsrfToken();
    expect(csrfTokensMatch(token, token)).toBe(true);
  });

  it("rejects missing or mismatched tokens", () => {
    const token = generateCsrfToken();
    expect(csrfTokensMatch(undefined, token)).toBe(false);
    expect(csrfTokensMatch(token, undefined)).toBe(false);
    expect(csrfTokensMatch(token, generateCsrfToken())).toBe(false);
  });
});
