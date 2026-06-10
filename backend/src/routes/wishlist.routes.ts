import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware";
import { WishlistController } from "../controllers/wishlist.controller";

export const wishlistRoutes = Router();

wishlistRoutes.use(authRequired);

wishlistRoutes.get("/", WishlistController.list);
wishlistRoutes.post("/:productId", WishlistController.add);
wishlistRoutes.delete("/:productId", WishlistController.remove);

