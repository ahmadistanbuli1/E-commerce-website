export function getApiOrigin() {
  const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
  return base.replace(/\/api\/?$/, "");
}

export function resolveImageUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${getApiOrigin()}${url}`;
  return url;
}

export const PRODUCT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export function validateProductImageFile(file: File): string | null {
  const allowedTypes = PRODUCT_IMAGE_ACCEPT.split(",");
  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, PNG, WEBP, and GIF images are allowed";
  }
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return "Image must be 5MB or smaller";
  }
  return null;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
