import { Router } from "express";

import { CreateBookController } from "@/domain/Books/useCases/createBook/create-book.controller";
import { ListBooksController } from "@/domain/Books/useCases/listBooks/list-books.controller";
import { UpdateBookController } from "@/domain/Books/useCases/updateBook/update-book.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const booksRoutes = Router();

const createBookController = new CreateBookController();
const listBooksController = new ListBooksController();
const updateBookController = new UpdateBookController();

booksRoutes.post("/", authMiddleware, createBookController.handle);
booksRoutes.get("/", authMiddleware, listBooksController.handle);
booksRoutes.patch("/:id", authMiddleware, updateBookController.handle);
