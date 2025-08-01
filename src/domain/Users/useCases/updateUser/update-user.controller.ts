import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { IUpdateUserDTO } from "../../dto/Iupdate-user.dto";
import { UpdateUserUseCase } from "./update-user.useCase";

const updateUserParamsSchema = z.object({
  id: z.string().uuid(),
});

const updateUserBodySchema = z.object({
  login: z.string().optional(),
  name: z.string().optional(),
  permission: z.enum(["operator", "admin"]).optional(),
  registration: z.string().optional(),
  role: z.string().optional(),
});

export class UpdateUserController {
  async handle(
    request: Request<{ id: string }, unknown, IUpdateUserDTO>,
    response: Response
  ) {
    const { id: userId } = updateUserParamsSchema.parse(request.params);

    const { login, name, permission, registration, role } =
      updateUserBodySchema.parse(request.body);

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
