import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { attachUserIfPresent } from "../middlewares/optionalAuth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
authRoutes.get("/me", attachUserIfPresent, AuthController.me);
authRoutes.post("/logout", AuthController.logout);

