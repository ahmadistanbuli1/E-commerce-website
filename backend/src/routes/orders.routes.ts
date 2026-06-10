import { Router } from "express";
import { authRequired, requireRole } from "../middlewares/auth.middleware";
import { OrdersController } from "../controllers/orders.controller";

export const ordersRoutes = Router();

ordersRoutes.use(authRequired);

ordersRoutes.post("/", OrdersController.checkout);
ordersRoutes.get("/my-orders", OrdersController.myOrders);

ordersRoutes.get("/", requireRole("ADMIN"), OrdersController.all);
ordersRoutes.put("/:id/status", requireRole("ADMIN"), OrdersController.updateStatus);

