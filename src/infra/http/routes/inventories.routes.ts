import { Router } from "express";

import { CreateInventoryController } from "@/domain/Establishments/useCases/createInventory/create-inventory.controller";
import { ListInventoriesController } from "@/domain/Establishments/useCases/listInventories/list-inventories.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const inventoriesRoutes = Router();

const createInventoryController = new CreateInventoryController();
const listInventoriesController = new ListInventoriesController();

inventoriesRoutes.post("/", authMiddleware, createInventoryController.handle);
inventoriesRoutes.get("/", authMiddleware, listInventoriesController.handle);
