import type { Request, Response } from "express";
import { z } from "zod";
import { UsersService } from "../services/users.service";
import { ActivityLogService } from "../services/activity-log.service";
import { activityActorFromRequest } from "../utils/request-context";
import type { Role } from "@prisma/client";

const emptyMsg = "This field is required";

const idParamSchema = z.object({
  id: z.string().uuid("Invalid id")
});

const profileUpdateSchema = z.object({
  firstName: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).min(3, "First name must be at least 3 characters").optional(),
  lastName: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).min(3, "Last name must be at least 3 characters").optional(),
  phone: z.string().trim().min(1, emptyMsg).optional().nullable()
});

const adminCreateSchema = z.object({
  firstName: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).min(3, "First name must be at least 3 characters"),
  lastName: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).min(3, "Last name must be at least 3 characters"),
  email: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).email("Invalid email address"),
  password: z.string({ error: emptyMsg }).min(1, emptyMsg),
  role: z.enum(["ADMIN", "CUSTOMER"]),
  phone: z.string().trim().optional().nullable()
});

const roleStatusSchema = z.object({
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  isBanned: z.boolean().optional()
});

export class UsersController {
  static async list(_req: Request, res: Response) {
    const users = await UsersService.list();
    return res.json({ users });
  }

  static async getById(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const user = await UsersService.getById(p.data.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  }

  static async updateProfile(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const b = profileUpdateSchema.safeParse(req.body);
    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });

    const user = await UsersService.updateProfile(p.data.id, b.data);
    return res.json({ user });
  }

  static async adminCreate(req: Request, res: Response) {
    const b = adminCreateSchema.safeParse(req.body);
    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });

    const result = await UsersService.adminCreateUser({
      ...b.data,
      role: b.data.role as Role
    });

    if (!result.ok) return res.status(409).json({ message: result.message });
    return res.status(201).json({ user: result.user });
  }

  static async adminRoleStatus(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const b = roleStatusSchema.safeParse(req.body);
    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });

    const user = await UsersService.adminUpdateRoleStatus(p.data.id, {
      role: b.data.role as Role | undefined,
      isBanned: b.data.isBanned
    });

    if (b.data.role !== undefined) {
      await ActivityLogService.record(
        "USER_ROLE_UPDATED",
        `Changed role for ${user.email} to ${user.role}`,
        activityActorFromRequest(req),
        { entityType: "User", entityId: user.id, metadata: { role: user.role } }
      );
    }

    if (b.data.isBanned === true) {
      await ActivityLogService.record(
        "USER_BANNED",
        `Banned user ${user.email}`,
        activityActorFromRequest(req),
        { entityType: "User", entityId: user.id }
      );
    } else if (b.data.isBanned === false) {
      await ActivityLogService.record(
        "USER_UNBANNED",
        `Unbanned user ${user.email}`,
        activityActorFromRequest(req),
        { entityType: "User", entityId: user.id }
      );
    }

    return res.json({ user });
  }

  static async adminArchive(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const user = await UsersService.adminArchiveUser(p.data.id);

    await ActivityLogService.record(
      "USER_ARCHIVED",
      `Archived user ${user.email}`,
      activityActorFromRequest(req),
      { entityType: "User", entityId: user.id }
    );

    return res.json({ user });
  }
}

