import { z } from "zod";

const emptyMsg = "This field is required";

export const productImageUrlSchema = z
  .string({ error: emptyMsg })
  .trim()
  .min(1, emptyMsg)
  .refine((value) => !value.includes(".."), "Invalid image path")
  .refine(
    (value) => value.startsWith("/uploads/") || /^https?:\/\//i.test(value),
    "Image must be an uploaded file or a valid URL"
  )
  .refine((value) => {
    if (!value.startsWith("/uploads/")) return true;
    return /^\/uploads\/[\w.-]+\.(jpg|jpeg|png|webp|gif)$/i.test(value);
  }, "Invalid uploaded image path");
