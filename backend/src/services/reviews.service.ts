import { prisma } from "../config/prisma";
import { computeAverageRating } from "../utils/product-meta";

export class ReviewsService {
  static async submit(userId: string, productId: string, score: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true, name: true }
    });

    if (!product || !product.isActive) {
      return { ok: false as const, message: "Product not found" };
    }

    const review = await prisma.productReview.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, score },
      update: { score },
      select: { id: true, score: true, createdAt: true, updatedAt: true }
    });

    const summary = await this.getProductRatingSummary(productId);

    return {
      ok: true as const,
      review,
      summary,
      productName: product.name
    };
  }

  static async getMyReview(userId: string, productId: string) {
    const review = await prisma.productReview.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true, score: true, createdAt: true, updatedAt: true }
    });
    return review;
  }

  static async getProductRatingSummary(productId: string) {
    const reviews = await prisma.productReview.findMany({
      where: { productId },
      select: { score: true }
    });

    const ratingCount = reviews.length;
    const averageRating = computeAverageRating(reviews.map((r) => r.score));

    return { averageRating, ratingCount };
  }
}
