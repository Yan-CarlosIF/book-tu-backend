import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { GetInventoryBooksUseCase } from "./get-inventory-books.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const queryParamsSchema = z.object({
  page: z.coerce.number().optional(),
});

type Params = z.infer<typeof paramsSchema>;

type QueryParams = z.infer<typeof queryParamsSchema>;

export class GetInventoryBooksController {
  async handle(
    request: Request<Params, unknown, unknown, QueryParams>,
    response: Response
  ) {
    const { id } = paramsSchema.parse(request.params);
    const { page } = queryParamsSchema.parse(request.query);

    const getInventoryBooksUseCase = container.resolve(
      GetInventoryBooksUseCase
    );

    const paginatedBooks = await getInventoryBooksUseCase.execute(page, id);

    return response.status(200).json(paginatedBooks);
  }
}
