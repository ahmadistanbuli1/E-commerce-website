import { Prisma, type OrderStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

export class OrdersService {
  static async checkoutFromCart(input: { userId: string; paymentMethod: string; shippingAddress: string }) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: input.userId },
        select: {
          id: true,
          items: { select: { productId: true, quantity: true } }
        }
      });

      if (!cart || cart.items.length === 0) {
        return { ok: false as const, message: "Cart is empty" };
      }

      const productIds = cart.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true, stock: true, isActive: true }
      });

      const byId = new Map(products.map((p) => [p.id, p]));

      for (const item of cart.items) {
        const p = byId.get(item.productId);
        if (!p || !p.isActive) return { ok: false as const, message: "Product not available" };
        if (item.quantity > p.stock) return { ok: false as const, message: "Insufficient stock" };
      }

      const total = cart.items.reduce((acc, item) => {
        const p = byId.get(item.productId)!;
        return acc.add(new Prisma.Decimal(p.price).mul(item.quantity));
      }, new Prisma.Decimal(0));

      const order = await tx.order.create({
        data: {
          userId: input.userId,
          totalPrice: total,
          status: "PENDING",
          paymentMethod: input.paymentMethod,
          shippingAddress: input.shippingAddress,
          items: {
            create: cart.items.map((item) => {
              const p = byId.get(item.productId)!;
              return {
                productId: item.productId,
                price: p.price,
                quantity: item.quantity
              };
            })
          }
        },
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentMethod: true,
          shippingAddress: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Deduct stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return {
        ok: true as const,
        order: { ...order, totalPrice: order.totalPrice.toString() }
      };
    });
  }

  static async myOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalPrice: true,
        status: true,
        paymentMethod: true,
        shippingAddress: true,
        adminMessage: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            price: true,
            quantity: true,
            product: { select: { id: true, name: true, imageUrl: true } }
          }
        }
      }
    });

    return orders.map((o) => ({
      ...o,
      totalPrice: o.totalPrice.toString(),
      items: o.items.map((i) => ({ ...i, price: i.price.toString() }))
    }));
  }

  static async allOrders() {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        totalPrice: true,
        status: true,
        paymentMethod: true,
        shippingAddress: true,
        adminMessage: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    return orders.map((o) => ({ ...o, totalPrice: o.totalPrice.toString() }));
  }

  static async updateStatus(orderId: string, status: OrderStatus, adminMessage?: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(adminMessage !== undefined ? { adminMessage: adminMessage.trim() || null } : {})
      },
      select: {
        id: true,
        userId: true,
        totalPrice: true,
        status: true,
        paymentMethod: true,
        shippingAddress: true,
        adminMessage: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return { ...order, totalPrice: order.totalPrice.toString() };
  }
}

