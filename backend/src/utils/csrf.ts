import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_MAX_AGE_MS } from "../config/auth";
import { env } from "../config/env";

export const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_PURPOSE = "csrf";

export function createCsrfToken() {
  return jwt.sign({ purpose: CSRF_PURPOSE }, env.JWT_SECRET, {
    expiresIn: Math.floor(REFRESH_TOKEN_MAX_AGE_MS / 1000)
  });
}

export function verifyCsrfToken(token: string | undefined) {
  if (!token) return false;

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return payload.purpose === CSRF_PURPOSE;
  } catch {
    return false;
  }
}
