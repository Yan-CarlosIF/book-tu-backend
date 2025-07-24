import { Router } from "express";

import { CreateUserController } from "@/domain/Users/useCases/createUser/create-user.controller";
import { DeleteUserController } from "@/domain/Users/useCases/deleteUser/delete-user.controller";
import { ListUsersController } from "@/domain/Users/useCases/listUsers/list-users.controller";
import { MeController } from "@/domain/Users/useCases/me/me.controller";
import { UpdateUserController } from "@/domain/Users/useCases/updateUser/update-user.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const meController = new MeController();
const listUsersController = new ListUsersController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

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
usersRoutes.patch(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  updateUserController.handle
);
usersRoutes.delete(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  deleteUserController.handle
);
