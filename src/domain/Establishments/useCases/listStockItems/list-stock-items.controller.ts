import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListStockItemsUseCase } from "./list-stock-items.useCase";

const queryParamsSchema = z.object({
  page: z.coerce.number().optional(),
  establishmentId: z.string().uuid().optional(),
});

type IQueryParams = z.infer<typeof queryParamsSchema>;

export class ListStockItemsController {
  async handle(
    request: Request<unknown, unknown, unknown, IQueryParams>,
    response: Response
  ) {
    const { page, establishmentId } = queryParamsSchema.parse(request.query);

    const listStockItemsUseCase = container.resolve(ListStockItemsUseCase);

    const paginatedStockItems = await listStockItemsUseCase.execute(
      page,
      establishmentId
    );

    return response.status(200).json(paginatedStockItems);
  }
}
