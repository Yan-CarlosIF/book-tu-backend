import { Router } from "express";

import { CreateCategoryController } from "@/domain/Books/useCases/createCategory/create-category.controller";
import { ListCategoriesController } from "@/domain/Books/useCases/listCategories/list-categories.controller";
import { UpdateCategoryController } from "@/domain/Books/useCases/updateCategory/update-category.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const updateCategoryController = new UpdateCategoryController();

categoriesRoutes.post("/", authMiddleware, createCategoryController.handle);
categoriesRoutes.get("/", authMiddleware, listCategoriesController.handle);
categoriesRoutes.patch("/:id", authMiddleware, updateCategoryController.handle);
