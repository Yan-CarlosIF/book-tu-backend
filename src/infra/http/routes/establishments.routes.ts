import { Router } from "express";

import { CreateEstablishmentController } from "@/domain/Establishments/useCases/createEstablishment/create-establishment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const establishmentRoutes = Router();

const createEstablishmentController = new CreateEstablishmentController();

establishmentRoutes.post(
  "/",
  authMiddleware,
  ensureUserAdmin,
  createEstablishmentController.handle
);
