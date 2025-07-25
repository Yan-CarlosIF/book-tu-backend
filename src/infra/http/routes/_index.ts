import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { booksRoutes } from "./books.routes";
import { categoriesRoutes } from "./categories.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/books", booksRoutes);
router.use("/categories", categoriesRoutes);
