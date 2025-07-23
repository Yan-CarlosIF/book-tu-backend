import { Router } from "express";

import { AuthenticateUserController } from "@/domain/Users/useCases/authenticateUser/authenticate-user.controller";

export const authRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authRoutes.post("/session", authenticateUserController.handle);
