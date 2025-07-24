import { Router } from "express";

import { CreateUserController } from "@/domain/Users/useCases/createUser/create-user.controller";
import { ListUsersController } from "@/domain/Users/useCases/listUsers/list-users.controller";
import { MeController } from "@/domain/Users/useCases/me/me.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const meController = new MeController();
const listUsersController = new ListUsersController();

usersRoutes.get("/me", authMiddleware, meController.handle);
usersRoutes.post(
  "/",
  authMiddleware,
  ensureUserAdmin,
  createUserController.handle
);
usersRoutes.get(
  "/",
  authMiddleware,
  ensureUserAdmin,
  listUsersController.handle
);
