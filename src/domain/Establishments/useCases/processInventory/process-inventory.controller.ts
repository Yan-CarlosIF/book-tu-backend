import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ProcessInventoryUseCase } from "./process-inventory.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export class ProcessInventoryController {
  async handle(request: Request<Params>, response: Response) {
    const { id } = paramsSchema.parse(request.params);

    const processInventoryUseCase = container.resolve(ProcessInventoryUseCase);

    await processInventoryUseCase.execute(id);

    return response.status(200).send();
  }
}
