import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { env } from "../config/env";
import { HttpError } from "../utils/http-error";

function zodFieldErrors(error: ZodError) {
  return error.flatten().fieldErrors;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    if (!err.expose && env.isProduction) {
      // eslint-disable-next-line no-console
      console.error(err);
      return res.status(err.statusCode).json({ message: "Request failed" });
    }
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: zodFieldErrors(err)
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Error && err.message.includes("CORS")) {
    return res.status(403).json({ message: "Forbidden by CORS policy" });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  if (env.isProduction) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  return res.status(500).json({ message, stack: err instanceof Error ? err.stack : undefined });
}
