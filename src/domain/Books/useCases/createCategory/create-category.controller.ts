import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { CreateCategoryUseCase } from "./create-category.useCase";

const createCategoryBodySchema = z.object({
  name: z.string(),
});

type ICreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export class CreateCategoryController {
  async handle(
    request: Request<unknown, unknown, ICreateCategoryBody>,
    response: Response
  ) {
    const { name } = createCategoryBodySchema.parse(request.body);

    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

    await createCategoryUseCase.execute(name);

    return response.status(201).send();
  }
}
