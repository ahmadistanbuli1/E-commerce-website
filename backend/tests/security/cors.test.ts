import { afterEach, describe, expect, it, vi } from "vitest";

describe("CORS origin policy", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("allows configured origins only", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CORS_ORIGIN", "https://e-commerce-website-sigma-lake.vercel.app");
    vi.stubEnv("JWT_SECRET", "production_secret_with_more_than_32_chars");
    vi.stubEnv("COOKIE_SECURE", "true");
    vi.stubEnv("COOKIE_SAMESITE", "none");

    const { isAllowedCorsOrigin } = await import("../../src/config/env");

    expect(isAllowedCorsOrigin("https://e-commerce-website-sigma-lake.vercel.app")).toBe(true);
    expect(isAllowedCorsOrigin("https://evil.vercel.app")).toBe(false);
    expect(isAllowedCorsOrigin("http://localhost:5173")).toBe(false);
  });

  it("normalizes trailing slashes", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CORS_ORIGIN", "https://shop.example.com/");

    const { isAllowedCorsOrigin } = await import("../../src/config/env");

    expect(isAllowedCorsOrigin("https://shop.example.com")).toBe(true);
  });
});
