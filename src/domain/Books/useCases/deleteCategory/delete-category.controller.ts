import type { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

import { DeleteCategoryUseCase } from "./delete-category.useCase";

const paramsSchema = z.object({
  id: z.uuidv4(),
});

type IParams = z.infer<typeof paramsSchema>;

export class DeleteCategoryController {
  async handle(request: Request<IParams>, response: Response) {
    const { id } = paramsSchema.parse(request.params);

    const deleteCategoryUseCase = container.resolve(DeleteCategoryUseCase);

    await deleteCategoryUseCase.execute(id);

    return response.status(200).send();
  }
}
