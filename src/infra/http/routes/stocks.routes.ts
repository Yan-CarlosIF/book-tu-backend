import { Router } from "express";

import { ListStockItemsController } from "@/domain/Establishments/useCases/listStockItems/list-stock-items.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const stocksRoutes = Router();

const listStockItemsController = new ListStockItemsController();

stocksRoutes.get("/", authMiddleware, listStockItemsController.handle);
