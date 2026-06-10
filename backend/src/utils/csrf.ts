import { randomBytes, timingSafeEqual } from "crypto";

export const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken() {
  return randomBytes(32).toString("base64url");
}

export function csrfTokensMatch(cookieToken: string | undefined, headerToken: string | undefined) {
  if (!cookieToken || !headerToken) {
    return false;
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);

  if (cookieBuffer.length !== headerBuffer.length) {
    return false;
  }

  return timingSafeEqual(cookieBuffer, headerBuffer);
}
