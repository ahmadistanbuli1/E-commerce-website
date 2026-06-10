import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_MAX_AGE_MS } from "../config/auth";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  role: "ADMIN" | "CUSTOMER";
};

const ACCESS_TOKEN_EXPIRES_IN_SECONDS = Math.floor(ACCESS_TOKEN_MAX_AGE_MS / 1000);

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

