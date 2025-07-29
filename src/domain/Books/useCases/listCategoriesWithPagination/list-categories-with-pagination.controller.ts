import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListCategoriesWithPaginationUseCase } from "./list-categories-with-pagination.useCase";

const queryParamsSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListCategoriesWithPaginationController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const { page, sort } = queryParamsSchema.parse(request.query);

    const listCategoriesWithPaginationUseCase = container.resolve(
      ListCategoriesWithPaginationUseCase
    );

    const paginatedCategories =
      await listCategoriesWithPaginationUseCase.execute(page, sort);

    return response.status(200).json(paginatedCategories);
  }
}
