import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { RefreshTokenService } from "./refresh-token.service";
import { signAccessToken } from "../utils/auth";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  isBanned: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true
} as const;

export class AuthService {
  static async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      return { ok: false as const, message: "Email already exists" };
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: passwordHash,
        role: "CUSTOMER",
        isBanned: false,
        deletedAt: null
      },
      select: userSelect
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = await RefreshTokenService.issue(user.id);

    return { ok: true as const, user, accessToken, refreshToken };
  }

  static async login(email: string, password: string) {
    const userWithPassword = await prisma.user.findUnique({ where: { email } });
    if (!userWithPassword) return { ok: false as const, message: "Invalid credentials" };
    if (userWithPassword.deletedAt) return { ok: false as const, message: "Invalid credentials" };
    if (userWithPassword.isBanned) return { ok: false as const, message: "Invalid credentials" };

    const ok = await bcrypt.compare(password, userWithPassword.password);
    if (!ok) return { ok: false as const, message: "Invalid credentials" };

    const user = await prisma.user.findUnique({
      where: { id: userWithPassword.id },
      select: userSelect
    });

    if (!user) return { ok: false as const, message: "Invalid credentials" };

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = await RefreshTokenService.issue(user.id);

    return { ok: true as const, user, accessToken, refreshToken };
  }
}
