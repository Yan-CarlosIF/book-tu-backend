import type { Request, Response } from "express";
import { container } from "tsyringe";

import { ICreateUserDTO } from "../../dto/Icreate-user.dto";
import { CreateUserUseCase } from "./create-user.useCase";

export class CreateUserController {
  async handle(
    request: Request<unknown, unknown, ICreateUserDTO>,
    response: Response
  ) {
    const { login, name, password, permission, registration, role } =
      request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      login,
      name,
      password,
      permission,
      registration,
      role,
    });

    return response.status(201).send();
  }
}
