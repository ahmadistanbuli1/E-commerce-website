import type { Prisma } from "@prisma/client";
import { Prisma as PrismaClient } from "@prisma/client";

export const NEW_PRODUCT_DAYS = 15;

export function computeIsNew(createdAt: Date): boolean {
  const ms = NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - createdAt.getTime() < ms;
}

export function computeDiscountPercent(
  price: Prisma.Decimal | string,
  compareAtPrice: Prisma.Decimal | string | null | undefined
): number | null {
  if (!compareAtPrice) return null;
  const current = Number(price.toString());
  const compare = Number(compareAtPrice.toString());
  if (!Number.isFinite(current) || !Number.isFinite(compare) || compare <= current) return null;
  return Math.round((1 - current / compare) * 100);
}

export function computeAverageRating(scores: number[]): number | null {
  if (scores.length === 0) return null;
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(avg * 10) / 10;
}

export function resolveCompareAtPrice(
  existing: { price: Prisma.Decimal; compareAtPrice: Prisma.Decimal | null },
  newPriceStr: string
): Prisma.Decimal | null {
  const newPrice = new PrismaClient.Decimal(newPriceStr);
  const oldPrice = existing.price;

  if (newPrice.lessThan(oldPrice)) {
    return oldPrice;
  }

  if (existing.compareAtPrice && newPrice.greaterThanOrEqualTo(existing.compareAtPrice)) {
    return null;
  }

  return existing.compareAtPrice;
}
