import { Router } from "express";

import { CreateEstablishmentController } from "@/domain/Establishments/useCases/createEstablishment/create-establishment.controller";
import { ListEstablishmentsWithPaginationController } from "@/domain/Establishments/useCases/ListEstablishmentsWithPagination/list-establishments-with-pagination.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const establishmentRoutes = Router();

const createEstablishmentController = new CreateEstablishmentController();
const listEstablishmentsWithPaginationController =
  new ListEstablishmentsWithPaginationController();

establishmentRoutes.post(
  "/",
  authMiddleware,
  ensureUserAdmin,
  createEstablishmentController.handle
);

establishmentRoutes.get(
  "/",
  authMiddleware,
  listEstablishmentsWithPaginationController.handle
);
