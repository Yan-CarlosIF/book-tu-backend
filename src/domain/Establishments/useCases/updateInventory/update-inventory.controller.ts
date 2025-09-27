import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { UpdateInventoryUseCase } from "./update-inventory.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updateInventoryBodySchema = z.object({
  establishment_id: z.string().uuid(),
  inventoryBooks: z.array(
    z.object({
      book_id: z.string().uuid(),
      quantity: z.number().int(),
    })
  ),
});

type RequestParams = z.infer<typeof paramsSchema>;
type RequestBody = z.infer<typeof updateInventoryBodySchema>;

export class UpdateInventoryController {
  async handle(
    request: Request<RequestParams, unknown, RequestBody>,
    response: Response
  ) {
    const { id } = paramsSchema.parse(request.params);
    const { inventoryBooks, establishment_id } =
      updateInventoryBodySchema.parse(request.body);

    const updateInventoryUseCase = container.resolve(UpdateInventoryUseCase);

    await updateInventoryUseCase.execute({
      id,
      inventoryBooks,
      establishment_id,
    });

    return response.status(200).send();
  }
}
