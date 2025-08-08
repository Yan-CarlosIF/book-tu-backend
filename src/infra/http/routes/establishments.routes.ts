import { Router } from "express";

import { CreateEstablishmentController } from "@/domain/Establishments/useCases/createEstablishment/create-establishment.controller";
import { ListEstablishmentsController } from "@/domain/Establishments/useCases/ListEstablishments/list-establishments.controller";
import { ListEstablishmentsWithPaginationController } from "@/domain/Establishments/useCases/ListEstablishmentsWithPagination/list-establishments-with-pagination.controller";
import { UpdateEstablishmentController } from "@/domain/Establishments/useCases/updateEstablishment/update-establishment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const establishmentRoutes = Router();

const createEstablishmentController = new CreateEstablishmentController();
const listEstablishmentsWithPaginationController =
  new ListEstablishmentsWithPaginationController();
const listEstablishmentsController = new ListEstablishmentsController();
const updateEstablishmentController = new UpdateEstablishmentController();

establishmentRoutes.get(
  "/",
  authMiddleware,
  listEstablishmentsWithPaginationController.handle
);
establishmentRoutes.get(
  "/all",
  authMiddleware,
  listEstablishmentsController.handle
);
establishmentRoutes.post(
  "/",
  authMiddleware,
  ensureUserAdmin,
  createEstablishmentController.handle
);
establishmentRoutes.patch(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  updateEstablishmentController.handle
);
