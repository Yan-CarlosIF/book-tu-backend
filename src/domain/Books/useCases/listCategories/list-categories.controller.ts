import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListCategoriesUseCase } from "./list-categories.useCase";

const queryParamsSchema = z.object({
  page: z.coerce.number().optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListCategoriesController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const { page } = queryParamsSchema.parse(request.query);

    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

    const {
      data: categories,
      page: currentPage,
      lastPage,
      total,
    } = await listCategoriesUseCase.execute(page);

    return response.status(200).json({
      categories,
      total,
      page: currentPage,
      lastPage,
    });
  }
}
