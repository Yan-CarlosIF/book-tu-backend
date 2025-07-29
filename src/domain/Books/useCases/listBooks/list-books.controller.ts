import type { Request, Response } from "express";
import { container } from "tsyringe";

import { ListBooksUseCase } from "./list-books.useCase";

export class ListBooksController {
  async handle(request: Request, response: Response) {
    const listBooksUseCase = container.resolve(ListBooksUseCase);

    const books = await listBooksUseCase.execute();

    return response.status(200).send(books);
  }
}
