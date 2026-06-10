import cors from "cors";
import { env, isAllowedCorsOrigin } from "../config/env";

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (isAllowedCorsOrigin(origin)) {
      callback(null, true);
      return;
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[cors] blocked origin: ${origin} | allowed: ${env.corsOrigins.join(", ") || "(none)"}`
    );
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  maxAge: 86400
});
