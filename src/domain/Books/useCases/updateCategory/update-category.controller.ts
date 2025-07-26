import type { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

import { UpdateCategoryUseCase } from "./update-category.useCase";

const paramsSchema = z.object({
  id: z.uuidv4(),
});

type IParams = z.infer<typeof paramsSchema>;

export class UpdateCategoryController {
  async handle(
    request: Request<IParams, unknown, { name: string }>,
    response: Response
  ) {
    const { id } = paramsSchema.parse(request.params);
    const { name } = request.body;

    const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

    await updateCategoryUseCase.execute(id, name);

    return response.status(204).send();
  }
}
