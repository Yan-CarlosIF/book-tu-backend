import type { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateBookUseCase } from "./update-book.useCase";

export interface IRequest {
  title?: string;
  author?: string;
  release_year?: number;
  price?: number;
  description?: string;
  categoryIds?: string[];
}

export class UpdateBookController {
  async handle(
    request: Request<{ id: string }, unknown, IRequest>,
    response: Response
  ) {
    const { id } = request.params;
    const { author, categoryIds, description, price, release_year, title } =
      request.body;

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
