import type { NextFunction, Request, Response } from "express";
import { CSRF_HEADER_NAME, verifyCsrfToken } from "../utils/csrf";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const EXEMPT_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh"
]);

function normalizePath(path: string) {
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

function requestPath(req: Request) {
  const raw = req.originalUrl.split("?")[0] || req.path;
  return normalizePath(raw);
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const path = requestPath(req);
  if (EXEMPT_PATHS.has(path)) {
    next();
    return;
  }

  const headerToken = req.get(CSRF_HEADER_NAME) ?? undefined;

  if (!verifyCsrfToken(headerToken)) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
}
