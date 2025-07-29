import type { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

import { ListBooksWithPaginationUseCase } from "./list-books-with-pagination.useCase";

const queryParamsSchema = z.object({
  sort: z
    .enum(["asc", "desc", "oldest", "latest", "price-asc", "price-desc"])
    .optional(),
  page: z.coerce.number().min(1).optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListBooksWithPaginationController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const { sort, page } = queryParamsSchema.parse(request.query);

    const listBooksWithPaginationUseCase = container.resolve(
      ListBooksWithPaginationUseCase
    );

    const paginatedBooks = await listBooksWithPaginationUseCase.execute(
      page,
      sort
    );

    return response.status(200).json(paginatedBooks);
  }
}
