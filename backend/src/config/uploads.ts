import path from "path";

export const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"] as const;

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;
