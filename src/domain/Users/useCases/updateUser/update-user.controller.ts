import type { Request, Response } from "express";
import { container } from "tsyringe";

import { IUpdateUserDTO } from "../../dto/Iupdate-user.dto";
import { UpdateUserUseCase } from "./update-user.useCase";

export class UpdateUserController {
  async handle(
    request: Request<{ id: string }, unknown, IUpdateUserDTO>,
    response: Response
  ) {
    const { id: userId } = request.params;

    const { login, name, permission, registration, role } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    await updateUserUseCase.execute(userId, {
      login,
      name,
      permission,
      registration,
      role,
    });

    return response.status(204).send();
  }
}
