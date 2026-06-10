import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { authRequired, requireRole } from "../middlewares/auth.middleware";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", CategoriesController.list);
categoriesRoutes.post("/", authRequired, requireRole("ADMIN"), CategoriesController.create);
categoriesRoutes.put("/:id", authRequired, requireRole("ADMIN"), CategoriesController.update);

