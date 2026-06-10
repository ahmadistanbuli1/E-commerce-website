import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

const LOW_STOCK_THRESHOLD = 10;

export class AdminDashboardService {
  static async getStats() {
    const [
      revenueAgg,
      totalOrders,
      pendingOrders,
      usersCount,
      lowStockProducts,
      ordersByStatus
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalPrice: true }
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: { stock: "asc" },
        take: 10,
        select: {
          id: true,
          name: true,
          stock: true,
          price: true,
          category: { select: { name: true } }
        }
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true }
      })
    ]);

    const totalRevenue = revenueAgg._sum.totalPrice ?? new Prisma.Decimal(0);

    return {
      totalRevenue: totalRevenue.toString(),
      totalOrders,
      pendingOrders,
      usersCount,
      lowStockProducts: lowStockProducts.map((p) => ({
        ...p,
        price: p.price.toString()
      })),
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count._all
      }))
    };
  }

  static async getRecentOrders(limit = 10) {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        totalPrice: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
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

    return orders.map((o) => ({
      ...o,
      totalPrice: o.totalPrice.toString()
    }));
  }
}
