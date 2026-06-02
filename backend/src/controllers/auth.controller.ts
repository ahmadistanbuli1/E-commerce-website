import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";
import { prisma } from "../config/prisma";

const emptyMsg = "لا يجب ان يكون فارغا";

const passwordSchema = z
  .string({ required_error: emptyMsg })
  .min(1, emptyMsg)
  .refine((v) => /\d/.test(v), "كلمة السر يجب ان تحتوي على رقم واحد على الأقل")
  .refine((v) => /[^\w\s]/.test(v), "كلمة السر يجب ان تحتوي على رمز واحد على الأقل");

const registerSchema = z.object({
  firstName: z.string({ required_error: emptyMsg }).trim().min(1, emptyMsg).min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  lastName: z.string({ required_error: emptyMsg }).trim().min(1, emptyMsg).min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string({ required_error: emptyMsg }).trim().min(1, emptyMsg).email("البريد الإلكتروني غير صحيح"),
  password: passwordSchema
});

const loginSchema = z.object({
  email: z.string({ required_error: emptyMsg }).trim().min(1, emptyMsg).email("البريد الإلكتروني غير صحيح"),
  password: z.string({ required_error: emptyMsg }).min(1, emptyMsg)
});

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: "/"
  });
}

export class AuthController {
  static async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const result = await AuthService.register(parsed.data);
    if (!result.ok) return res.status(409).json({ message: result.message });

    setAuthCookie(res, result.token);
    return res.status(201).json({ user: result.user });
  }

  static async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const result = await AuthService.login(parsed.data.email, parsed.data.password);
    if (!result.ok) return res.status(401).json({ message: result.message });

    setAuthCookie(res, result.token);
    return res.status(200).json({ user: result.user });
  }

  static async me(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    return res.json({ user });
  }
}

