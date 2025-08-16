import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { CreateBookUseCase } from "./create-book.useCase";

const createBookBodySchema = z.object({
  title: z.string(),
  identifier: z.string(),
  author: z.string(),
  release_year: z.number(),
  price: z.number(),
  description: z.string().optional(),
  categoryIds: z.array(z.string()),
});

export type ICreateBookBody = z.infer<typeof createBookBodySchema>;

export class CreateBookController {
  async handle(
    request: Request<unknown, unknown, ICreateBookBody>,
    response: Response
  ) {
    const {
      title,
      identifier,
      author,
      release_year,
      price,
      description,
      categoryIds,
    } = createBookBodySchema.parse(request.body);

    const createBookUseCase = container.resolve(CreateBookUseCase);

    await createBookUseCase.execute({
      title,
      identifier,
      author,
      release_year,
      price,
      description,
      categoryIds,
    });

    return response.status(201).send();
  }
}
