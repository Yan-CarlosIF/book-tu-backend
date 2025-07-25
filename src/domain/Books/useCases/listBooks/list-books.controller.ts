import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListBooksUseCase } from "./list-books.useCase";

const queryParamsSchema = z.object({
  sort: z
    .enum([
      "asc",
      "desc",
      "release-asc",
      "release-desc",
      "price-asc",
      "price-desc",
    ])
    .optional(),
  page: z.coerce.number().optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListBooksController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const queryParams = queryParamsSchema.parse(request.query);

    const { page, sort } = queryParams;

    const listBooksUseCase = container.resolve(ListBooksUseCase);

    const {
      data: books,
      page: currentPage,
      lastPage,
      total,
    } = await listBooksUseCase.execute(sort, page);

    return response.status(200).send({
      books,
      total,
      page: currentPage,
      lastPage,
    });
  }
}
