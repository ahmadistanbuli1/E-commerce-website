import "dotenv/config";
import { z } from "zod";

const DEFAULT_JWT_SECRETS = new Set([
  "change_me_change_me",
  "change_me",
  "your-secret-key",
  "secret"
]);

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(16),
    PORT: z.coerce.number().int().positive().default(4000),
    CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
    COOKIE_NAME: z.string().min(1).default("access_token"),
    REFRESH_COOKIE_NAME: z.string().min(1).default("refresh_token"),
    CSRF_COOKIE_NAME: z.string().min(1).default("csrf_token"),
    COOKIE_SECURE: z.coerce.boolean().default(false),
    COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
    TRUST_PROXY: z.coerce.boolean().default(false),
    JSON_BODY_LIMIT: z.string().default("100kb"),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    UPLOAD_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30)
  })
  .superRefine((data, ctx) => {
    if (data.COOKIE_SAMESITE === "none" && !data.COOKIE_SECURE) {
      ctx.addIssue({
        code: "custom",
        message: "COOKIE_SECURE must be true when COOKIE_SAMESITE is none",
        path: ["COOKIE_SECURE"]
      });
    }

    if (data.NODE_ENV !== "production") return;

    if (!data.COOKIE_SECURE) {
      ctx.addIssue({
        code: "custom",
        message: "COOKIE_SECURE must be true in production",
        path: ["COOKIE_SECURE"]
      });
    }

    if (data.JWT_SECRET.length < 32) {
      ctx.addIssue({
        code: "custom",
        message: "JWT_SECRET must be at least 32 characters in production",
        path: ["JWT_SECRET"]
      });
    }

    if (DEFAULT_JWT_SECRETS.has(data.JWT_SECRET)) {
      ctx.addIssue({
        code: "custom",
        message: "JWT_SECRET must not use a default placeholder in production",
        path: ["JWT_SECRET"]
      });
    }

    if (data.CORS_ORIGIN.includes("localhost")) {
      ctx.addIssue({
        code: "custom",
        message: "CORS_ORIGIN should not include localhost in production",
        path: ["CORS_ORIGIN"]
      });
    }
  });

const parsed = envSchema.parse(process.env);

function normalizeOrigin(origin: string) {
  return origin
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/+$/, "");
}

export const env = {
  ...parsed,
  corsOrigins: parsed.CORS_ORIGIN.split(",")
    .map(normalizeOrigin)
    .filter(Boolean),
  isProduction: parsed.NODE_ENV === "production",
  isDevelopment: parsed.NODE_ENV === "development"
};

export function isAllowedCorsOrigin(origin: string) {
  const normalized = normalizeOrigin(origin);
  return env.corsOrigins.includes(normalized);
}
