import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware";
import { CartController } from "../controllers/cart.controller";

export const cartRoutes = Router();

cartRoutes.use(authRequired);

cartRoutes.get("/", CartController.get);
cartRoutes.post("/items", CartController.addItem);
cartRoutes.put("/items/:itemId", CartController.updateItem);
cartRoutes.delete("/items/:itemId", CartController.removeItem);
cartRoutes.delete("/", CartController.clear);

