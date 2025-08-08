import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { DeleteEstablishmentUseCase } from "./delete-establishment.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type IParams = z.infer<typeof paramsSchema>;

export class DeleteEstablishmentController {
  async handle(request: Request<IParams>, response: Response) {
    const { id } = paramsSchema.parse(request.params);

    const deleteEstablishmentUseCase = container.resolve(
      DeleteEstablishmentUseCase
    );

    await deleteEstablishmentUseCase.execute(id);

    return response.status(204).send();
  }
}
