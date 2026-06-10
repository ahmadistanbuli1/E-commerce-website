import type { Request, Response } from "express";

import { z } from "zod";

import { env } from "../config/env";

import { AuthService } from "../services/auth.service";

import { ActivityLogService } from "../services/activity-log.service";

import { prisma } from "../config/prisma";

import { activityActorFromRequest } from "../utils/request-context";



const emptyMsg = "This field is required";



const passwordSchema = z

  .string({ error: emptyMsg })

  .min(1, emptyMsg)

  .refine((v) => /\d/.test(v), "Password must contain at least 1 number")

  .refine(

    (v) => /[^\w\s]/.test(v),

    "Password must contain at least 1 symbol",

  );



const registerSchema = z.object({

  firstName: z

    .string({ error: emptyMsg })

    .trim()

    .min(1, emptyMsg)

    .min(3, "First name must be at least 3 characters"),

  lastName: z

    .string({ error: emptyMsg })

    .trim()

    .min(1, emptyMsg)

    .min(3, "Last name must be at least 3 characters"),

  email: z

    .string({ error: emptyMsg })

    .trim()

    .min(1, emptyMsg)

    .email("Invalid email address"),

  password: passwordSchema,

});



const loginSchema = z.object({

  email: z

    .string({ error: emptyMsg })

    .trim()

    .min(1, emptyMsg)

    .email("Invalid email address"),

  password: z.string({ error: emptyMsg }).min(1, emptyMsg),

});



function setAuthCookie(res: Response, token: string) {

  res.cookie(env.COOKIE_NAME, token, {

    httpOnly: true,

    secure: env.COOKIE_SECURE,

    sameSite: env.COOKIE_SAMESITE,

    path: "/",

  });

}



export class AuthController {

  static async register(req: Request, res: Response) {

    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {

      return res.status(400).json({

        message: "Validation error",

        errors: parsed.error.flatten().fieldErrors,

      });

    }



    const result = await AuthService.register(parsed.data);

    if (!result.ok) return res.status(409).json({ message: result.message });



    setAuthCookie(res, result.token);



    await ActivityLogService.record(

      "USER_REGISTERED",

      `New account registered: ${result.user.email}`,

      activityActorFromRequest(req, {

        id: result.user.id,

        role: result.user.role,

        email: result.user.email

      }),

      { entityType: "User", entityId: result.user.id }

    );



    return res.status(201).json({ user: result.user });

  }



  static async login(req: Request, res: Response) {

    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {

      return res.status(400).json({

        message: "Validation error",

        errors: parsed.error.flatten().fieldErrors,

      });

    }



    const result = await AuthService.login(

      parsed.data.email,

      parsed.data.password,

    );

    if (!result.ok) return res.status(401).json({ message: result.message });



    setAuthCookie(res, result.token);



    await ActivityLogService.record(

      "USER_LOGIN",

      `User logged in: ${result.user.email}`,

      activityActorFromRequest(req, {

        id: result.user.id,

        role: result.user.role,

        email: result.user.email

      }),

      { entityType: "User", entityId: result.user.id }

    );



    return res.status(200).json({ user: result.user });

  }



  static async me(req: Request, res: Response) {
    if (!req.user) return res.json({ user: null });

    const user = await prisma.user.findUnique({

      where: { id: req.user.id },

      select: {

        id: true,

        firstName: true,

        lastName: true,

        email: true,

        phone: true,

        role: true,

        isBanned: true,

        deletedAt: true,

        createdAt: true,

        updatedAt: true,

      },

    });

    if (!user) return res.json({ user: null });
    if (user.deletedAt || user.isBanned) return res.json({ user: null });

    return res.json({ user });

  }



  static async logout(req: Request, res: Response) {

    await ActivityLogService.record(

      "USER_LOGOUT",

      "User logged out",

      activityActorFromRequest(req)

    );



    res.clearCookie(env.COOKIE_NAME, {

      path: "/",

      httpOnly: true,

      secure: env.COOKIE_SECURE,

      sameSite: env.COOKIE_SAMESITE

    });

    return res.status(204).send();

  }

}

