import { createHash, randomBytes } from "crypto";
import { REFRESH_TOKEN_MAX_AGE_MS } from "../config/auth";
import { prisma } from "../config/prisma";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function generateRawToken() {
  return randomBytes(32).toString("base64url");
}

export class RefreshTokenService {
  static async issue(userId: string) {
    const rawToken = generateRawToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawToken),
        expiresAt
      }
    });

    return rawToken;
  }

  static async rotate(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            deletedAt: true,
            isBanned: true
          }
        }
      }
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      return { ok: false as const, message: "Invalid refresh token" };
    }

    if (stored.user.deletedAt || stored.user.isBanned) {
      await prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() }
      });
      return { ok: false as const, message: "Invalid refresh token" };
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    const nextRefreshToken = await this.issue(stored.userId);

    return {
      ok: true as const,
      userId: stored.user.id,
      role: stored.user.role,
      refreshToken: nextRefreshToken
    };
  }

  static async revoke(rawToken: string | undefined) {
    if (!rawToken) return;

    const tokenHash = hashToken(rawToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  static async revokeAllForUser(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
}
