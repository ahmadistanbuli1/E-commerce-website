import { prisma } from "../config/prisma";

export class CategoriesService {
  static async list() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true, createdAt: true, updatedAt: true }
    });
  }

  static async create(input: { name: string; description: string }) {
    return prisma.category.create({
      data: { name: input.name, description: input.description },
      select: { id: true, name: true, description: true, createdAt: true, updatedAt: true }
    });
  }

  static async update(id: string, input: { name: string; description: string }) {
    return prisma.category.update({
      where: { id },
      data: { name: input.name, description: input.description },
      select: { id: true, name: true, description: true, createdAt: true, updatedAt: true }
    });
  }
}

