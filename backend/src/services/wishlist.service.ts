import { prisma } from "../config/prisma";

import { Prisma } from "@prisma/client";

import { productSelect, serializeProduct } from "../utils/serialize-product";



export class WishlistService {

  static async list(userId: string) {

    const items = await prisma.wishlistItem.findMany({

      where: { userId },

      orderBy: { createdAt: "desc" },

      select: {

        id: true,

        createdAt: true,

        product: { select: productSelect }

      }

    });



    return items.map((i) => ({

      id: i.id,

      createdAt: i.createdAt,

      product: serializeProduct(i.product)

    }));

  }



  static async add(userId: string, productId: string) {

    const product = await prisma.product.findUnique({

      where: { id: productId },

      select: { id: true, isActive: true, name: true }

    });

    if (!product || !product.isActive) return { ok: false as const, message: "Product not available" };



    try {

      await prisma.wishlistItem.create({ data: { userId, productId } });

    } catch (e) {

      const code = (e as Prisma.PrismaClientKnownRequestError).code;

      if (code !== "P2002") throw e;

    }



    return { ok: true as const, productName: product.name };

  }



  static async remove(userId: string, productId: string) {

    const product = await prisma.product.findUnique({

      where: { id: productId },

      select: { name: true }

    });



    await prisma.wishlistItem.deleteMany({ where: { userId, productId } });

    return { ok: true as const, productName: product?.name };

  }

}

