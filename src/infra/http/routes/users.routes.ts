import { Router } from "express";

import { CreateUserController } from "@/domain/Users/useCases/createUser/create-user.controller";

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post("/", createUserController.handle);
