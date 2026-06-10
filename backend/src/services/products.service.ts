import { prisma } from "../config/prisma";
import { paginationSchema } from "../utils/pagination";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { resolveCompareAtPrice } from "../utils/product-meta";
import { productSelect, serializeProduct } from "../utils/serialize-product";
import { deleteUploadFile } from "../utils/upload-files";

const listQuerySchema = paginationSchema.extend({
  categoryId: z.string().uuid().optional(),
  search: z.string().trim().min(1).optional(),
  includeInactive: z.coerce.boolean().optional().default(false),
  sortBy: z.enum(["createdAt", "price", "name"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

export type ProductsListQuery = z.infer<typeof listQuerySchema>;

export class ProductsService {
  static parseListQuery(input: unknown) {
    return listQuerySchema.safeParse(input);
  }

  static async list(query: ProductsListQuery, isAdmin: boolean) {
    const where: Prisma.ProductWhereInput = {};

    if (!isAdmin || !query.includeInactive) where.isActive = true;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } }
      ];
    }

    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: productSelect
      })
    ]);

    return {
      items: items.map(serializeProduct),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  }

  static async getById(id: string, isAdmin: boolean) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: productSelect
    });

    if (!product) return null;
    if (!isAdmin && !product.isActive) return null;
    return serializeProduct(product);
  }

  static async create(input: {
    categoryId: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    imageUrl: string;
  }) {
    const product = await prisma.product.create({
      data: {
        categoryId: input.categoryId,
        name: input.name,
        description: input.description,
        price: new Prisma.Decimal(input.price),
        stock: input.stock,
        imageUrl: input.imageUrl,
        isActive: true
      },
      select: productSelect
    });

    return serializeProduct(product);
  }

  static async update(id: string, input: Partial<{
    categoryId: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    imageUrl: string;
    isActive: boolean;
  }>) {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { price: true, compareAtPrice: true, isActive: true, name: true, imageUrl: true }
    });

    if (!existing) throw new Error("Product not found");

    const data: Prisma.ProductUpdateInput = {
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.stock !== undefined ? { stock: input.stock } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
    };

    if (input.price !== undefined) {
      data.price = new Prisma.Decimal(input.price);
      data.compareAtPrice = resolveCompareAtPrice(existing, input.price);
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      select: productSelect
    });

    if (
      input.imageUrl !== undefined &&
      input.imageUrl !== existing.imageUrl
    ) {
      await deleteUploadFile(existing.imageUrl);
    }

    return serializeProduct(product);
  }

  static async archive(id: string) {
    return this.update(id, { isActive: false });
  }

  static async hardDelete(id: string) {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    try {
      await prisma.product.delete({ where: { id } });
      await deleteUploadFile(existing?.imageUrl);
      return { ok: true as const };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") return { ok: false as const, message: "Product not found" };
        if (e.code === "P2003") {
          return {
            ok: false as const,
            message: "Cannot delete product linked to existing orders. Archive it instead."
          };
        }
      }
      throw e;
    }
  }
}
