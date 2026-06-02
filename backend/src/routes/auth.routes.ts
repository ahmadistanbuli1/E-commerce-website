import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authRequired } from "../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
authRoutes.get("/me", authRequired, AuthController.me);

