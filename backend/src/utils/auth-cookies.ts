import type { Response } from "express";
import { ACCESS_TOKEN_MAX_AGE_MS, REFRESH_TOKEN_MAX_AGE_MS } from "../config/auth";
import { env } from "../config/env";
import { baseCookieOptions, clearCookieOptions, httpOnlyCookieOptions } from "./cookie-options";
import { createCsrfToken } from "./csrf";

export function setSessionCookies(
  res: Response,
  input: { accessToken: string; refreshToken: string; csrfToken?: string }
) {
  const csrfToken = input.csrfToken ?? createCsrfToken();

  res.cookie(env.COOKIE_NAME, input.accessToken, httpOnlyCookieOptions(ACCESS_TOKEN_MAX_AGE_MS));
  res.cookie(
    env.REFRESH_COOKIE_NAME,
    input.refreshToken,
    httpOnlyCookieOptions(REFRESH_TOKEN_MAX_AGE_MS)
  );
  res.cookie(env.CSRF_COOKIE_NAME, csrfToken, baseCookieOptions(REFRESH_TOKEN_MAX_AGE_MS));

  return csrfToken;
}

export function setAccessCookie(res: Response, accessToken: string) {
  res.cookie(env.COOKIE_NAME, accessToken, httpOnlyCookieOptions(ACCESS_TOKEN_MAX_AGE_MS));
}

export function clearSessionCookies(res: Response) {
  const options = clearCookieOptions();

  res.clearCookie(env.COOKIE_NAME, options);
  res.clearCookie(env.REFRESH_COOKIE_NAME, options);
  res.clearCookie(env.CSRF_COOKIE_NAME, {
    path: "/",
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE
  });
}
