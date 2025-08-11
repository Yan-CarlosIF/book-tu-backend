import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { CreateInventoryUseCase } from "./create-inventory.useCase";

const createInventoryBodySchema = z.object({
  establishment_id: z.string().uuid(),
  total_quantity: z.number().int(),
  inventoryBooks: z.array(
    z.object({
      book_id: z.string().uuid(),
      quantity: z.number().int(),
    })
  ),
});

type CreateInventoryBody = z.infer<typeof createInventoryBodySchema>;

export class CreateInventoryController {
  async handle(
    request: Request<unknown, unknown, CreateInventoryBody>,
    response: Response
  ) {
    const { establishment_id, inventoryBooks, total_quantity } =
      createInventoryBodySchema.parse(request.body);

    const createInventoryUseCase = container.resolve(CreateInventoryUseCase);

    await createInventoryUseCase.execute({
      total_quantity,
      establishment_id,
      inventoryBooks,
    });

    return response.status(201).send();
  }
}
