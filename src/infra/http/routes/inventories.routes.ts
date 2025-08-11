import { Router } from "express";

import { CreateInventoryController } from "@/domain/Establishments/useCases/createInventory/create-inventory.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const inventoriesRoutes = Router();

const createInventoryController = new CreateInventoryController();

inventoriesRoutes.post("/", authMiddleware, createInventoryController.handle);
