import { Router } from "express";
import { UploadsController } from "../controllers/uploads.controller";
import { authRequired, requireRole } from "../middlewares/auth.middleware";
import { uploadRateLimiter } from "../middlewares/rate-limit.middleware";
import { handleUploadError, productImageUpload } from "../middlewares/upload.middleware";

export const uploadsRoutes = Router();

uploadsRoutes.post(
  "/product-image",
  uploadRateLimiter,
  authRequired,
  requireRole("ADMIN"),
  (req, res, next) => {
    productImageUpload.single("image")(req, res, (err) => {
      if (err) return handleUploadError(err, req, res, next);
      return UploadsController.uploadProductImage(req, res);
    });
  }
);
