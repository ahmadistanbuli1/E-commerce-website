import rateLimit from "express-rate-limit";
import { env } from "../config/env";

const rateLimitMessage = {
  message: "Too many requests. Please try again later."
};

function createLimiter(max: number) {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitMessage
  });
}

export const apiRateLimiter = createLimiter(env.RATE_LIMIT_MAX);

export const authRateLimiter = createLimiter(env.AUTH_RATE_LIMIT_MAX);

export const uploadRateLimiter = createLimiter(env.UPLOAD_RATE_LIMIT_MAX);
