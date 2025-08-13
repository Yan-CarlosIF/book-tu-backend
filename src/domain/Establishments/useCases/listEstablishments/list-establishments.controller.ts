import type { Request, Response } from "express";
import { container } from "tsyringe";

import { ListEstablishmentsUseCase } from "./list-establishments.useCase";

export class ListEstablishmentsController {
  async handle(request: Request, response: Response) {
    const listEstablishmentsUseCase = container.resolve(
      ListEstablishmentsUseCase
    );

    const establishments = await listEstablishmentsUseCase.execute();

    return response.status(200).json(establishments);
  }
}
