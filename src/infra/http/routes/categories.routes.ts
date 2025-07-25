import { Router } from "express";

import { CreateCategoryController } from "@/domain/Books/useCases/createCategory/create-category.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();

categoriesRoutes.post("/", authMiddleware, createCategoryController.handle);
