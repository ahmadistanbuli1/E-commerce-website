import { Router } from "express";

import { authRequired, requireRole } from "../middlewares/auth.middleware";

import { AdminDashboardController } from "../controllers/admin-dashboard.controller";

import { ActivityLogController } from "../controllers/activity-log.controller";



export const adminRoutes = Router();



adminRoutes.use(authRequired, requireRole("ADMIN"));



adminRoutes.get("/dashboard/stats", AdminDashboardController.stats);

adminRoutes.get("/dashboard/recent-orders", AdminDashboardController.recentOrders);

adminRoutes.get("/activity-logs", ActivityLogController.list);

