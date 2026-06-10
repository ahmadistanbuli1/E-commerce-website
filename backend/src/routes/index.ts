import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { authRoutes } from "./auth.routes";
import { usersRoutes } from "./users.routes";
import { categoriesRoutes } from "./categories.routes";
import { productsRoutes } from "./products.routes";
import { cartRoutes } from "./cart.routes";
import { wishlistRoutes } from "./wishlist.routes";
import { ordersRoutes } from "./orders.routes";
import { adminRoutes } from "./admin.routes";
import { uploadsRoutes } from "./uploads.routes";

export const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/products", productsRoutes);
routes.use("/cart", cartRoutes);
routes.use("/wishlist", wishlistRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/admin", adminRoutes);
routes.use("/admin/uploads", uploadsRoutes);

