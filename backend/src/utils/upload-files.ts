import fs from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "../config/uploads";

export function isManagedUploadUrl(url: string) {
  return url.startsWith("/uploads/") && !url.includes("..");
}

export function resolveUploadFilePath(imageUrl: string) {
  if (!isManagedUploadUrl(imageUrl)) return null;
  const filename = path.basename(imageUrl);
  const filePath = path.resolve(UPLOADS_DIR, filename);
  if (!filePath.startsWith(UPLOADS_DIR)) return null;
  return filePath;
}

export async function deleteUploadFile(imageUrl: string | null | undefined) {
  if (!imageUrl) return;
  const filePath = resolveUploadFilePath(imageUrl);
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}
