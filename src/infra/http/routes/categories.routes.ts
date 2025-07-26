import { Router } from "express";

import { CreateCategoryController } from "@/domain/Books/useCases/createCategory/create-category.controller";
import { DeleteCategoryController } from "@/domain/Books/useCases/deleteCategory/delete-category.controller";
import { ListCategoriesController } from "@/domain/Books/useCases/listCategories/list-categories.controller";
import { UpdateCategoryController } from "@/domain/Books/useCases/updateCategory/update-category.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();

categoriesRoutes.post("/", authMiddleware, createCategoryController.handle);
categoriesRoutes.get("/", authMiddleware, listCategoriesController.handle);
categoriesRoutes.patch("/:id", authMiddleware, updateCategoryController.handle);
categoriesRoutes.delete(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  deleteCategoryController.handle
);
