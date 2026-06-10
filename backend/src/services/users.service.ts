import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import type { Role } from "@prisma/client";

type PublicUserSelect = {
  id: true;
  firstName: true;
  lastName: true;
  email: true;
  phone: true;
  role: true;
  isBanned: true;
  deletedAt: true;
  createdAt: true;
  updatedAt: true;
};

const publicUserSelect: PublicUserSelect = {
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
};

export class UsersService {
  static async list() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: publicUserSelect
    });
  }

  static async getById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: publicUserSelect
    });
  }

  static async updateProfile(id: string, data: { firstName?: string; lastName?: string; phone?: string | null }) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
        ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {})
      },
      select: publicUserSelect
    });
  }

  static async adminCreateUser(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    phone?: string | null;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) return { ok: false as const, message: "Email already exists" };

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: passwordHash,
        role: input.role,
        phone: input.phone ?? undefined
      },
      select: publicUserSelect
    });

    return { ok: true as const, user };
  }

  static async adminUpdateRoleStatus(id: string, data: { role?: Role; isBanned?: boolean }) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.isBanned !== undefined ? { isBanned: data.isBanned } : {})
      },
      select: publicUserSelect
    });
  }

  static async adminArchiveUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: publicUserSelect
    });
  }
}

