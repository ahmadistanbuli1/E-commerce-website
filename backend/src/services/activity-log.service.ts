import type { ActivityAction, Role } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { paginationSchema } from "../utils/pagination";
import { z } from "zod";

export type ActivityActor = {
  actorId?: string;
  actorEmail?: string;
  actorRole?: Role;
  ipAddress?: string;
};

const activityActionSchema = z.enum([
  "USER_REGISTERED",
  "USER_LOGIN",
  "USER_LOGOUT",
  "PRODUCT_CREATED",
  "PRODUCT_UPDATED",
  "PRODUCT_ARCHIVED",
  "PRODUCT_RESTORED",
  "PRODUCT_DELETED",
  "CATEGORY_CREATED",
  "CATEGORY_UPDATED",
  "ORDER_CREATED",
  "ORDER_STATUS_UPDATED",
  "CART_ITEM_ADDED",
  "CART_ITEM_UPDATED",
  "CART_ITEM_REMOVED",
  "CART_CLEARED",
  "WISHLIST_ADDED",
  "WISHLIST_REMOVED",
  "REVIEW_SUBMITTED",
  "USER_ROLE_UPDATED",
  "USER_BANNED",
  "USER_UNBANNED",
  "USER_ARCHIVED"
]);

const listQuerySchema = paginationSchema.extend({
  action: activityActionSchema.optional()
});

export type ActivityLogsListQuery = z.infer<typeof listQuerySchema>;

export class ActivityLogService {
  static parseListQuery(input: unknown) {
    return listQuerySchema.safeParse(input);
  }

  static async record(
    action: ActivityAction,
    description: string,
    actor?: ActivityActor,
    meta?: {
      entityType?: string;
      entityId?: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    try {
      let actorEmail = actor?.actorEmail;
      if (actor?.actorId && !actorEmail) {
        const user = await prisma.user.findUnique({
          where: { id: actor.actorId },
          select: { email: true }
        });
        actorEmail = user?.email ?? undefined;
      }

      await prisma.activityLog.create({
        data: {
          action,
          description,
          entityType: meta?.entityType,
          entityId: meta?.entityId,
          metadata: (meta?.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
          actorId: actor?.actorId,
          actorEmail,
          actorRole: actor?.actorRole,
          ipAddress: actor?.ipAddress
        }
      });
    } catch {
      // Logging must never break the main request flow.
    }
  }

  static async list(query: ActivityLogsListQuery) {
    const where = query.action ? { action: query.action } : {};
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [total, items] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          description: true,
          entityType: true,
          entityId: true,
          metadata: true,
          actorId: true,
          actorEmail: true,
          actorRole: true,
          ipAddress: true,
          createdAt: true
        }
      })
    ]);

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  }
}
