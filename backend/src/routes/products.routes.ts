import { Router } from "express";
import { ProductsController } from "../controllers/products.controller";
import { ReviewsController } from "../controllers/reviews.controller";
import { authRequired, requireRole } from "../middlewares/auth.middleware";
import { attachUserIfPresent } from "../middlewares/optionalAuth.middleware";

export const productsRoutes = Router();

productsRoutes.use(attachUserIfPresent);
productsRoutes.get("/", ProductsController.list);
productsRoutes.post("/:id/reviews", authRequired, ReviewsController.submit);
productsRoutes.get("/:id/reviews/me", authRequired, ReviewsController.myReview);
productsRoutes.get("/:id", ProductsController.getById);

productsRoutes.post("/", authRequired, requireRole("ADMIN"), ProductsController.create);
productsRoutes.put("/:id", authRequired, requireRole("ADMIN"), ProductsController.update);
productsRoutes.delete("/:id/permanent", authRequired, requireRole("ADMIN"), ProductsController.hardDelete);
productsRoutes.delete("/:id", authRequired, requireRole("ADMIN"), ProductsController.archive);
