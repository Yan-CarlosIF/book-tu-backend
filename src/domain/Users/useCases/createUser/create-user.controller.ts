import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ICreateUserDTO } from "../../dto/Icreate-user.dto";
import { Permission } from "../../infra/typeorm/entities/User";
import { CreateUserUseCase } from "./create-user.useCase";

const createUserBodySchema = z.object({
  login: z.string(),
  name: z.string(),
  password: z.string().min(3),
  permission: z.enum(["operator", "admin"]),
  registration: z.string(),
  role: z.string(),
});

export class CreateUserController {
  async handle(
    request: Request<unknown, unknown, ICreateUserDTO>,
    response: Response
  ) {
    const { login, name, password, permission, registration, role } =
      createUserBodySchema.parse(request.body);

    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      login,
      name,
      password,
      permission: permission as Permission,
      registration,
      role,
    });

    return response.status(201).send();
  }
}
