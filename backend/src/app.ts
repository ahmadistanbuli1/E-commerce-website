import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { UPLOADS_DIR } from "./config/uploads";
import { routes } from "./routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { ensureUploadsDir } from "./utils/upload-files";

export async function createApp() {
  await ensureUploadsDir();

  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use("/uploads", express.static(UPLOADS_DIR));
  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

