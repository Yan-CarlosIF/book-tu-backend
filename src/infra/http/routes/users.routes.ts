import { Router } from "express";

import { CreateUserController } from "@/domain/Users/useCases/createUser/create-user.controller";
import { MeController } from "@/domain/Users/useCases/me/me.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const meController = new MeController();

usersRoutes.get("/me", authMiddleware, meController.handle);

usersRoutes.post(
  "/",
  authMiddleware,
  ensureUserAdmin,
  createUserController.handle
);
