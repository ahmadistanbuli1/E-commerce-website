import express from "express";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { UPLOADS_DIR } from "./config/uploads";
import { routes } from "./routes";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware";
import { csrfProtection } from "./middlewares/csrf.middleware";
import { securityHeaders, uploadsSecurityHeaders } from "./middlewares/security.middleware";
import { ensureUploadsDir } from "./utils/upload-files";

export async function createApp() {
  await ensureUploadsDir();

  const app = express();

  app.disable("x-powered-by");

  if (env.TRUST_PROXY) {
    app.set("trust proxy", 1);
  }

  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: false, limit: env.JSON_BODY_LIMIT }));
  app.use(cookieParser());
  app.use(csrfProtection);

  app.use("/uploads", uploadsSecurityHeaders, express.static(UPLOADS_DIR, { dotfiles: "deny", index: false }));
  app.use("/api", apiRateLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
