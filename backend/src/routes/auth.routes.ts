import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { attachUserIfPresent } from "../middlewares/optionalAuth.middleware";
import { authRateLimiter } from "../middlewares/rate-limit.middleware";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimiter, AuthController.register);
authRoutes.post("/login", authRateLimiter, AuthController.login);
authRoutes.post("/refresh", authRateLimiter, AuthController.refresh);
authRoutes.get("/me", attachUserIfPresent, AuthController.me);
authRoutes.post("/logout", AuthController.logout);
