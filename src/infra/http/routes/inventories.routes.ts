import { Router } from "express";

import { CreateInventoryController } from "@/domain/Establishments/useCases/createInventory/create-inventory.controller";
import { DeleteInventoryController } from "@/domain/Establishments/useCases/deleteInventory/delete-inventory.controller";
import { GetInventoryController } from "@/domain/Establishments/useCases/getInventory/get-inventory.controller";
import { GetInventoryBooksController } from "@/domain/Establishments/useCases/getInventoryBooks/get-inventory-books.controller";
import { ListInventoriesController } from "@/domain/Establishments/useCases/listInventories/list-inventories.controller";
import { ProcessInventoryController } from "@/domain/Establishments/useCases/processInventory/process-inventory.controller";
import { SyncInventoryController } from "@/domain/Establishments/useCases/syncInventory/sync-inventory.controller";
import { UpdateInventoryController } from "@/domain/Establishments/useCases/updateInventory/update-inventory.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const inventoriesRoutes = Router();

const createInventoryController = new CreateInventoryController();
const listInventoriesController = new ListInventoriesController();
const getInventoryController = new GetInventoryController();
const updateInventoryController = new UpdateInventoryController();
const deleteInventoryController = new DeleteInventoryController();
const processInventory = new ProcessInventoryController();
const getInventoryBooksController = new GetInventoryBooksController();
const syncInventoryController = new SyncInventoryController();

inventoriesRoutes.post("/", authMiddleware, createInventoryController.handle);
inventoriesRoutes.get("/", authMiddleware, listInventoriesController.handle);
inventoriesRoutes.get("/:id", authMiddleware, getInventoryController.handle);
inventoriesRoutes.get(
  "/:id/books",
  authMiddleware,
  getInventoryBooksController.handle
);
inventoriesRoutes.put("/:id", authMiddleware, updateInventoryController.handle);
inventoriesRoutes.delete(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  deleteInventoryController.handle
);
inventoriesRoutes.post(
  "/process/:id",
  authMiddleware,
  ensureUserAdmin,
  processInventory.handle
);
inventoriesRoutes.post("/sync", authMiddleware, syncInventoryController.handle);
