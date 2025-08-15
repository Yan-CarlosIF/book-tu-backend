import { Router } from "express";

import { CreateInventoryController } from "@/domain/Establishments/useCases/createInventory/create-inventory.controller";
import { DeleteInventoryController } from "@/domain/Establishments/useCases/deleteInventory/delete-inventory.controller";
import { GetInventoryController } from "@/domain/Establishments/useCases/getInventory/get-inventory.controller";
import { ListInventoriesController } from "@/domain/Establishments/useCases/listInventories/list-inventories.controller";
import { UpdateInventoryController } from "@/domain/Establishments/useCases/updateInventory/update-inventory.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const inventoriesRoutes = Router();

const createInventoryController = new CreateInventoryController();
const listInventoriesController = new ListInventoriesController();
const getInventoryController = new GetInventoryController();
const updateInventoryController = new UpdateInventoryController();
const deleteInventoryController = new DeleteInventoryController();

inventoriesRoutes.post("/", authMiddleware, createInventoryController.handle);
inventoriesRoutes.get("/", authMiddleware, listInventoriesController.handle);
inventoriesRoutes.get("/:id", authMiddleware, getInventoryController.handle);
inventoriesRoutes.put("/:id", authMiddleware, updateInventoryController.handle);
inventoriesRoutes.delete(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  deleteInventoryController.handle
);
