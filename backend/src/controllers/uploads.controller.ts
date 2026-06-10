import type { Request, Response } from "express";
import { z } from "zod";
import { ActivityLogService } from "../services/activity-log.service";
import { activityActorFromRequest } from "../utils/request-context";
import { deleteUploadFile, isManagedUploadUrl } from "../utils/upload-files";

const previousUrlQuerySchema = z.object({
  previousUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isManagedUploadUrl(value), "Invalid previous image path")
});

export class UploadsController {
  static async uploadProductImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const parsed = previousUrlQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    if (parsed.data.previousUrl && parsed.data.previousUrl !== imageUrl) {
      await deleteUploadFile(parsed.data.previousUrl);
    }

    await ActivityLogService.record(
      "PRODUCT_UPDATED",
      `Uploaded product image ${req.file.filename}`,
      activityActorFromRequest(req),
      { entityType: "Product", metadata: { imageUrl } }
    );

    return res.status(201).json({ imageUrl });
  }
}
