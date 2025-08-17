import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListEstablishmentsWithPaginationUseCase } from "./list-establishments-with-pagination.useCase";

const queryParamsSchema = z.object({
  page: z.coerce.number().optional(),
  search: z.string().optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListEstablishmentsWithPaginationController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const { page, search } = queryParamsSchema.parse(request.query);

    const listEstablishmentsWithPaginationUseCase = container.resolve(
      ListEstablishmentsWithPaginationUseCase
    );

    const paginatedEstablishments =
      await listEstablishmentsWithPaginationUseCase.execute(page, search);

    return response.status(200).json(paginatedEstablishments);
  }
}
