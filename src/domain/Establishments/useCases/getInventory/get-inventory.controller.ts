import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { GetInventoryUseCase } from "./get-inventory.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export class GetInventoryController {
  async handle(request: Request<Params>, response: Response) {
    const { id } = paramsSchema.parse(request.params);

    const getInventoryUseCase = container.resolve(GetInventoryUseCase);

    const inventory = await getInventoryUseCase.execute(id);

    return response.status(200).json(inventory);
  }
}
