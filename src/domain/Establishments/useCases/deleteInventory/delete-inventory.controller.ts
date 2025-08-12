import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { DeleteInventoryUseCase } from "./delete-inventory.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type IParams = z.infer<typeof paramsSchema>;

export class DeleteInventoryController {
  async handle(request: Request<IParams>, response: Response) {
    const { id } = paramsSchema.parse(request.params);

    const deleteInventoryUseCase = container.resolve(DeleteInventoryUseCase);

    await deleteInventoryUseCase.execute(id);

    return response.status(204).send();
  }
}
