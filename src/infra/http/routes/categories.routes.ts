import { Router } from "express";

import { CreateCategoryController } from "@/domain/Books/useCases/createCategory/create-category.controller";
import { DeleteCategoryController } from "@/domain/Books/useCases/deleteCategory/delete-category.controller";
import { ListCategoriesController } from "@/domain/Books/useCases/listCategories/list-categories.controller";
import { ListCategoriesWithPaginationController } from "@/domain/Books/useCases/listCategoriesWithPagination/list-categories-with-pagination.controller";
import { UpdateCategoryController } from "@/domain/Books/useCases/updateCategory/update-category.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesWithPaginationController =
  new ListCategoriesWithPaginationController();
const listCategoriesController = new ListCategoriesController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();

categoriesRoutes.post("/", authMiddleware, createCategoryController.handle);
categoriesRoutes.get("/all", authMiddleware, listCategoriesController.handle);
categoriesRoutes.get(
  "/",
  authMiddleware,
  listCategoriesWithPaginationController.handle
);
categoriesRoutes.patch("/:id", authMiddleware, updateCategoryController.handle);
categoriesRoutes.delete(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  deleteCategoryController.handle
);
