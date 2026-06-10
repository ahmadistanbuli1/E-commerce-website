import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

type SerializedCart = {
  id: string;
  userId: string;
  updatedAt: Date;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    product: {
      id: string;
      name: string;
      description: string;
      price: string;
      stock: number;
      imageUrl: string;
      isActive: boolean;
      category: { id: string; name: string };
    };
  }>;
  total: string;
} | null;

function serializeCart(cart: SerializedCart) {
  return cart;
}

export class CartService {
  static async getOrCreateCart(userId: string) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: { userId },
      select: { id: true }
    });
  }

  static async getCart(userId: string): Promise<SerializedCart> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        updatedAt: true,
        items: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                imageUrl: true,
                isActive: true,
                category: { select: { id: true, name: true } }
              }
            }
          }
        }
      }
    });

    if (!cart) return null;

    const items = cart.items.map((i) => {
      const unitPrice = i.product.price.toString();
      const lineTotal = new Prisma.Decimal(i.product.price).mul(i.quantity).toString();
      return {
        id: i.id,
        quantity: i.quantity,
        unitPrice,
        lineTotal,
        product: {
          ...i.product,
          price: unitPrice
        }
      };
    });

    const total = items
      .reduce((acc, i) => acc.add(new Prisma.Decimal(i.lineTotal)), new Prisma.Decimal(0))
      .toString();

    return serializeCart({
      id: cart.id,
      userId: cart.userId,
      updatedAt: cart.updatedAt,
      items,
      total
    });
  }

  static async addItem(userId: string, input: { productId: string; quantity: number }) {
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      select: { id: true, isActive: true, stock: true }
    });
    if (!product || !product.isActive) return { ok: false as const, message: "Product not available" };
    if (input.quantity <= 0) return { ok: false as const, message: "Quantity must be at least 1" };

    const cart = await this.getOrCreateCart(userId);

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: input.productId } },
      select: { id: true, quantity: true }
    });

    const nextQty = (existing?.quantity ?? 0) + input.quantity;
    if (nextQty > product.stock) return { ok: false as const, message: "Insufficient stock" };

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: nextQty }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: input.productId, quantity: input.quantity }
      });
    }

    return { ok: true as const, cart: await this.getCart(userId) };
  }

  static async updateItem(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) return { ok: false as const, message: "Quantity must be at least 1" };

    const cart = await prisma.cart.findUnique({ where: { userId }, select: { id: true } });
    if (!cart) return { ok: false as const, message: "Cart not found" };

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      select: { id: true, productId: true }
    });
    if (!item) return { ok: false as const, message: "Item not found" };

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { isActive: true, stock: true }
    });
    if (!product || !product.isActive) return { ok: false as const, message: "Product not available" };
    if (quantity > product.stock) return { ok: false as const, message: "Insufficient stock" };

    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    return { ok: true as const, cart: await this.getCart(userId) };
  }

  static async removeItem(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId }, select: { id: true } });
    if (!cart) return { ok: true as const, cart: await this.getCart(userId) };

    await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
    return { ok: true as const, cart: await this.getCart(userId) };
  }

  static async clear(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId }, select: { id: true } });
    if (!cart) return { ok: true as const, cart: await this.getCart(userId) };

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { ok: true as const, cart: await this.getCart(userId) };
  }
}

