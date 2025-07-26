import { Router } from "express";

import { CreateBookController } from "@/domain/Books/useCases/createBook/create-book.controller";
import { DeleteBookController } from "@/domain/Books/useCases/deleteBook/delete-book.controller";
import { ListBooksController } from "@/domain/Books/useCases/listBooks/list-books.controller";
import { UpdateBookController } from "@/domain/Books/useCases/updateBook/update-book.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureUserAdmin } from "../middlewares/ensure-user-admin.middleware";

export const booksRoutes = Router();

const createBookController = new CreateBookController();
const listBooksController = new ListBooksController();
const updateBookController = new UpdateBookController();
const deleteBookController = new DeleteBookController();

booksRoutes.post("/", authMiddleware, createBookController.handle);
booksRoutes.get("/", authMiddleware, listBooksController.handle);
booksRoutes.patch("/:id", authMiddleware, updateBookController.handle);
booksRoutes.delete(
  "/:id",
  authMiddleware,
  ensureUserAdmin,
  deleteBookController.handle
);
