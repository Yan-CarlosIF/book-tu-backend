import type { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUsersUseCase } from "./list-users.useCase";

export class ListUsersController {
  async handle(_request: Request, response: Response) {
    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const users = await listUsersUseCase.execute();

    return response.status(200).send(users);
  }
}
