import { Router } from "express";

import { CreateBookController } from "@/domain/Books/useCases/createBook/create-book.controller";
import { ListBooksController } from "@/domain/Books/useCases/listBooks/list-books.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const booksRoutes = Router();

const createBookController = new CreateBookController();
const listBooksController = new ListBooksController();

booksRoutes.post("/", authMiddleware, createBookController.handle);
booksRoutes.get("/", authMiddleware, listBooksController.handle);
