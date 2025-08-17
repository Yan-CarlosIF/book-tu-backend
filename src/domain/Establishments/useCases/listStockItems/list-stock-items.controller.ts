import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListStockItemsUseCase } from "./list-stock-items.useCase";

const queryParamsSchema = z.object({
  page: z.coerce.number().optional(),
  establishmentId: z.string().uuid().optional(),
  search: z.string().optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListStockItemsController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const { page, establishmentId, search } = queryParamsSchema.parse(
      request.query
    );

    const listStockItemsUseCase = container.resolve(ListStockItemsUseCase);

    const paginatedStockItems = await listStockItemsUseCase.execute(
      page,
      establishmentId,
      search
    );

    return response.status(200).json(paginatedStockItems);
  }
}
