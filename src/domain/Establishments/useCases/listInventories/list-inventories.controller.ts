import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ListInventoriesUseCase } from "./list-inventories.useCase";

const queryParamsSchema = z.object({
  page: z.coerce.number().optional(),
  establishmentId: z.string().uuid().optional(),
  search: z.string().optional(),
});

type queryParams = z.infer<typeof queryParamsSchema>;

export class ListInventoriesController {
  async handle(
    request: Request<unknown, unknown, unknown, queryParams>,
    response: Response
  ) {
    const { page, establishmentId, search } = queryParamsSchema.parse(
      request.query
    );

    const listInventoriesUseCase = container.resolve(ListInventoriesUseCase);

    const paginatedInventories = await listInventoriesUseCase.execute(
      page,
      establishmentId,
      search
    );

    return response.status(200).json(paginatedInventories);
  }
}
