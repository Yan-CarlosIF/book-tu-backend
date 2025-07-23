import type { Request, Response } from "express";
import { container } from "tsyringe";

import { IAuthenticateUserDTO } from "../../dto/Iauthenticate-user.dto";
import { AuthenticateUserUseCase } from "./authenticate-user.useCase";

export class AuthenticateUserController {
  async handle(
    request: Request<unknown, unknown, IAuthenticateUserDTO>,
    response: Response
  ) {
    const { login, password } = request.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute({ login, password });

    return response.status(200).json({ token });
  }
}
