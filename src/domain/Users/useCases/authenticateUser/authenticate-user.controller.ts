import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { IAuthenticateUserDTO } from "../../dto/Iauthenticate-user.dto";
import { AuthenticateUserUseCase } from "./authenticate-user.useCase";

const authenticateUserBodySchema = z.object({
  login: z.string(),
  password: z.string().min(3),
});

export class AuthenticateUserController {
  async handle(
    request: Request<unknown, unknown, IAuthenticateUserDTO>,
    response: Response
  ) {
    const { login, password } = authenticateUserBodySchema.parse(request.body);

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute({ login, password });

    return response.status(200).json({ token });
  }
}
