import { Router } from "express";

import { CreateUserController } from "@/domain/Users/useCases/createUser/create-user.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post(
  "/",
  authMiddleware,
  ensureUserAdmin,
  createUserController.handle
);
