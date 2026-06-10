import type { Request, Response } from "express";
import { z } from "zod";
import { ReviewsService } from "../services/reviews.service";
import { ActivityLogService } from "../services/activity-log.service";
import { activityActorFromRequest } from "../utils/request-context";

const idParamSchema = z.object({
  id: z.string().uuid("Invalid id")
});

const submitSchema = z.object({
  score: z.coerce.number().int().min(1, "Score must be at least 1").max(5, "Score must be at most 5")
});

export class ReviewsController {
  static async submit(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const b = submitSchema.safeParse(req.body);
    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });

    const result = await ReviewsService.submit(req.user!.id, p.data.id, b.data.score);
    if (!result.ok) return res.status(404).json({ message: result.message });

    await ActivityLogService.record(
      "REVIEW_SUBMITTED",
      `Rated "${result.productName}" ${b.data.score}/5 stars`,
      activityActorFromRequest(req),
      {
        entityType: "Product",
        entityId: p.data.id,
        metadata: { score: b.data.score, averageRating: result.summary.averageRating }
      }
    );

    return res.json({ review: result.review, summary: result.summary });
  }

  static async myReview(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const review = await ReviewsService.getMyReview(req.user!.id, p.data.id);
    return res.json({ review });
  }
}
