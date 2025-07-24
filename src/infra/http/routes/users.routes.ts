import { Router } from "express";

import { CreateUserController } from "@/domain/Users/useCases/createUser/create-user.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post("/", authMiddleware, createUserController.handle);
