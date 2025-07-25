import { Router } from "express";

import { CreateBookController } from "@/domain/Books/useCases/createBook/create-book.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

export const booksRoutes = Router();

const createBookController = new CreateBookController();

booksRoutes.post("/", authMiddleware, createBookController.handle);
