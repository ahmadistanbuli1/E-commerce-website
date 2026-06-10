import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { authRequired, requireRole } from "../middlewares/auth.middleware";

export const usersRoutes = Router();

// All users routes require auth
usersRoutes.use(authRequired);

// Admin routes
usersRoutes.get("/", requireRole("ADMIN"), UsersController.list);
usersRoutes.post("/", requireRole("ADMIN"), UsersController.adminCreate);
usersRoutes.put("/:id/role-status", requireRole("ADMIN"), UsersController.adminRoleStatus);
usersRoutes.delete("/:id", requireRole("ADMIN"), UsersController.adminArchive);

function ownerOrAdmin(req: Parameters<typeof authRequired>[0], res: Parameters<typeof authRequired>[1], next: Parameters<typeof authRequired>[2]) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role === "ADMIN") return next();
  if (req.user.id === req.params.id) return next();
  return res.status(403).json({ message: "Forbidden" });
}

// Owner/Admin routes
usersRoutes.get("/:id", ownerOrAdmin, UsersController.getById);
usersRoutes.put("/:id", ownerOrAdmin, UsersController.updateProfile);

