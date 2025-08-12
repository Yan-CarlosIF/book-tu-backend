import { Router } from "express";

import { CreateInventoryController } from "@/domain/Establishments/useCases/createInventory/create-inventory.controller";
import { ListInventoriesController } from "@/domain/Establishments/useCases/listInventories/list-inventories.controller";
import { UpdateInventoryController } from "@/domain/Establishments/useCases/updateInventory/update-inventory.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const inventoriesRoutes = Router();

const createInventoryController = new CreateInventoryController();
const listInventoriesController = new ListInventoriesController();
const updateInventoryController = new UpdateInventoryController();

inventoriesRoutes.post("/", authMiddleware, createInventoryController.handle);
inventoriesRoutes.get("/", authMiddleware, listInventoriesController.handle);
inventoriesRoutes.put("/:id", authMiddleware, updateInventoryController.handle);
