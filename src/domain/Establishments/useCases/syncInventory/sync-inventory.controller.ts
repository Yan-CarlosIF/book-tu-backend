import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { SyncInventoryUseCase } from "./sync-inventory.useCase";

const syncInventoryBodySchema = z.object({
  establishment_id: z.string().uuid(),
  total_quantity: z.number().int(),
  inventoryBooks: z.array(
    z.object({
      book_id: z.string().uuid(),
      quantity: z.number().int(),
    })
  ),
});

type SyncInventoryBody = z.infer<typeof syncInventoryBodySchema>;

export class SyncInventoryController {
  async handle(
    request: Request<unknown, unknown, SyncInventoryBody>,
    response: Response
  ) {
    const { establishment_id, inventoryBooks, total_quantity } =
      syncInventoryBodySchema.parse(request.body);

    const syncInventoryUseCase = container.resolve(SyncInventoryUseCase);

    const data = await syncInventoryUseCase.execute({
      total_quantity,
      establishment_id,
      inventoryBooks,
    });

    if (data.wasCreated) {
      return response
        .status(201)
        .json({ ...data, message: "Inventário sincronizado com sucesso" });
    }

    return response.status(400).json({
      ...data,
      message: "Erro ao sincronizar o inventário",
    });
  }
}
