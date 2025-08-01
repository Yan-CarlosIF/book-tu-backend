import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { UpdateBookUseCase } from "./update-book.useCase";

const updateBookParamsSchema = z.object({
  id: z.uuidv4(),
});

const updateBookBodySchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  release_year: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type IUpdateBookBody = z.infer<typeof updateBookBodySchema>;

export class UpdateBookController {
  async handle(
    request: Request<{ id: string }, unknown, IUpdateBookBody>,
    response: Response
  ) {
    const { id } = updateBookParamsSchema.parse(request.params);
    const { author, categoryIds, description, price, release_year, title } =
      updateBookBodySchema.parse(request.body);

    const updateBookUseCase = container.resolve(UpdateBookUseCase);

    await updateBookUseCase.execute(id, {
      author,
      categoryIds,
      description,
      price,
      release_year,
      title,
    });

    return response.status(204).send();
  }
}
