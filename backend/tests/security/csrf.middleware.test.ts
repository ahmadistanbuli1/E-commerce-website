import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { csrfProtection } from "../../src/middlewares/csrf.middleware";
import { createCsrfToken } from "../../src/utils/csrf";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(csrfProtection);
  app.post("/api/auth/login", (_req, res) => res.json({ ok: true }));
  app.post("/api/cart/items", (_req, res) => res.json({ ok: true }));
  return app;
}

describe("CSRF middleware", () => {
  it("allows login without CSRF token", async () => {
    const app = buildApp();
    const response = await request(app).post("/api/auth/login").send({ email: "a@b.com" });
    expect(response.status).toBe(200);
  });

  it("blocks mutating requests without CSRF token", async () => {
    const app = buildApp();
    const response = await request(app).post("/api/cart/items").send({ productId: "1" });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Invalid CSRF token");
  });

  it("allows mutating requests with a valid signed CSRF header", async () => {
    const app = buildApp();
    const token = createCsrfToken();

    const response = await request(app)
      .post("/api/cart/items")
      .set("X-CSRF-Token", token)
      .send({ productId: "1" });

    expect(response.status).toBe(200);
  });
});
