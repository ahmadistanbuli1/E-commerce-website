import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { CSRF_HEADER_NAME, csrfTokensMatch } from "../utils/csrf";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const EXEMPT_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/register"
]);

function normalizePath(path: string) {
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const path = normalizePath(req.path);
  if (EXEMPT_PATHS.has(path)) {
    next();
    return;
  }

  const cookieToken = req.cookies?.[env.CSRF_COOKIE_NAME] as string | undefined;
  const headerToken = req.get(CSRF_HEADER_NAME) ?? undefined;

  if (!csrfTokensMatch(cookieToken, headerToken)) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
}
