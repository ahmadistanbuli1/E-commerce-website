import { Prisma } from "@prisma/client";
import {
  computeAverageRating,
  computeDiscountPercent,
  computeIsNew
} from "./product-meta";

export const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  imageUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
  reviews: { select: { score: true } }
} as const;

export type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

export function serializeProduct(p: ProductRecord) {
  const scores = p.reviews.map((r) => r.score);
  const averageRating = computeAverageRating(scores);
  const ratingCount = scores.length;
  const discountPercent = computeDiscountPercent(p.price, p.compareAtPrice);

  const { reviews: _reviews, ...rest } = p;

  return {
    ...rest,
    price: p.price.toString(),
    compareAtPrice: p.compareAtPrice?.toString() ?? null,
    averageRating,
    ratingCount,
    discountPercent,
    isNew: computeIsNew(p.createdAt)
  };
}
