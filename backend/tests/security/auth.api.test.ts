import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/config/prisma";
import type { Express } from "express";

describe("Auth API security", () => {
  let app: Express;
  let dbReady = false;

  beforeAll(async () => {
    try {
      app = await createApp();
      await prisma.$queryRaw`SELECT 1`;
      dbReady = true;
    } catch {
      dbReady = false;
    }
  });

  it("returns anonymous session for /auth/me", async (ctx) => {
    if (!dbReady) ctx.skip();
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(200);
    expect(response.body.user).toBeNull();
  });

  it("rejects invalid login credentials", async (ctx) => {
    if (!dbReady) ctx.skip();
    const response = await request(app).post("/api/auth/login").send({
      email: "missing@example.com",
      password: "WrongPass1!"
    });

    expect(response.status).toBe(401);
  });

  it("rejects weak register payload", async (ctx) => {
    if (!dbReady) ctx.skip();
    const response = await request(app).post("/api/auth/register").send({
      firstName: "ab",
      lastName: "cd",
      email: "not-an-email",
      password: "weak"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
  });
});
