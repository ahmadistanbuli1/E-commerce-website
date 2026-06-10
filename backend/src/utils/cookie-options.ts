import type { CookieOptions } from "express";
import { env } from "../config/env";

export function baseCookieOptions(maxAge: number): CookieOptions {
  return {
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: "/",
    maxAge
  };
}

export function httpOnlyCookieOptions(maxAge: number): CookieOptions {
  return {
    ...baseCookieOptions(maxAge),
    httpOnly: true
  };
}

export function clearCookieOptions(): CookieOptions {
  return {
    path: "/",
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE
  };
}
