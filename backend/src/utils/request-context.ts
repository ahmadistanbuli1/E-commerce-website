import type { Request } from "express";
import type { Role } from "@prisma/client";

export type ActivityActor = {
  actorId?: string;
  actorEmail?: string;
  actorRole?: Role;
  ipAddress?: string;
};

export function activityActorFromRequest(
  req: Request,
  user?: { id: string; role: Role; email?: string }
): ActivityActor {
  return {
    actorId: user?.id ?? req.user?.id,
    actorEmail: user?.email,
    actorRole: user?.role ?? req.user?.role,
    ipAddress: req.ip
  };
}
