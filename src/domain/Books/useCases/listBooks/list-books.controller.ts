import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListBooksUseCase } from "./list-books.useCase";

const queryParamsSchema = z.object({
  search: z.string().optional(),
});
export class ListBooksController {
  async handle(request: Request, response: Response) {
    const { search } = queryParamsSchema.parse(request.query);

    const listBooksUseCase = container.resolve(ListBooksUseCase);

    const books = await listBooksUseCase.execute(search);

    return response.status(200).send(books);
  }
}
