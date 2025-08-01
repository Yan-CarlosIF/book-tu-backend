import type { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

import { UpdateCategoryUseCase } from "./update-category.useCase";

const paramsSchema = z.object({
  id: z.uuidv4(),
});

const updateCategoryBodySchema = z.object({
  name: z.string(),
});

type IParams = z.infer<typeof paramsSchema>;

export class UpdateCategoryController {
  async handle(
    request: Request<IParams, unknown, { name: string }>,
    response: Response
  ) {
    const { id } = paramsSchema.parse(request.params);
    const { name } = updateCategoryBodySchema.parse(request.body);

    const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

    await updateCategoryUseCase.execute(id, name);

    return response.status(204).send();
  }
}
