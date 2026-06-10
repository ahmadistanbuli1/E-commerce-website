import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  UPLOADS_DIR
} from "../config/uploads";
import { ensureUploadsDir } from "../utils/upload-files";

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await ensureUploadsDir();
      cb(null, UPLOADS_DIR);
    } catch (error) {
      cb(error as Error, UPLOADS_DIR);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_IMAGE_EXTENSIONS.includes(ext as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])
      ? ext
      : ".jpg";
    cb(null, `${Date.now()}-${randomUUID()}${safeExt}`);
  }
});

function isAllowedImage(file: Express.Multer.File) {
  const ext = path.extname(file.originalname).toLowerCase();
  return (
    ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]) &&
    ALLOWED_IMAGE_EXTENSIONS.includes(ext as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])
  );
}

export const productImageUpload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedImage(file)) {
      cb(new Error("Only JPG, PNG, WEBP, and GIF images up to 5MB are allowed"));
      return;
    }
    cb(null, true);
  }
});

export function handleUploadError(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image must be 5MB or smaller" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: 'Use the "image" field for uploads' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }

  return next(err);
}
