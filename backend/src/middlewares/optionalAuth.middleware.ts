import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { verifyAccessToken } from "../utils/auth";

export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.COOKIE_NAME] as string | undefined;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // ignore invalid token for public endpoints
  }

  return next();
}

