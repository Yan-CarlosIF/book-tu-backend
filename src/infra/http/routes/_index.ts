import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { booksRoutes } from "./books.routes";
import { categoriesRoutes } from "./categories.routes";
import { establishmentRoutes } from "./establishments.routes";
import { inventoriesRoutes } from "./inventories.routes";
import { stocksRoutes } from "./stocks.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/books", booksRoutes);
router.use("/categories", categoriesRoutes);
router.use("/establishments", establishmentRoutes);
router.use("/stocks", stocksRoutes);
router.use("/inventories", inventoriesRoutes);
