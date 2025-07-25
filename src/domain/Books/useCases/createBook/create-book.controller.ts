import type { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateBookUseCase } from "./create-book.useCase";

export interface IRequest {
  title: string;
  author: string;
  release_year: number;
  price: number;
  description?: string;
  categoryIds: string[];
}

export class CreateBookController {
  async handle(
    request: Request<unknown, unknown, IRequest>,
    response: Response
  ) {
    const { title, author, release_year, price, description, categoryIds } =
      request.body;

    const createBookUseCase = container.resolve(CreateBookUseCase);

    await createBookUseCase.execute({
      title,
      author,
      release_year,
      price,
      description,
      categoryIds,
    });

    return response.status(201).send();
  }
}
