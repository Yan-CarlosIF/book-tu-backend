import type { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

import { DeleteBookUseCase } from "./delete-book.useCase";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type IParams = z.infer<typeof paramsSchema>;

export class DeleteBookController {
  async handle(request: Request<IParams>, response: Response) {
    const { id } = paramsSchema.parse(request.params);

    const deleteBookUseCase = container.resolve(DeleteBookUseCase);

    await deleteBookUseCase.execute(id);

    return response.status(200).send();
  }
}
