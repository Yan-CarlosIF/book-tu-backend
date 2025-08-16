import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { env } from "@/config/env";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";
import { AppError } from "@/infra/errors/app-error";

import { IAuthenticateUserDTO } from "../../dto/Iauthenticate-user.dto";

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ login, password }: IAuthenticateUserDTO) {
    const user = await this.usersRepository.findByLogin(login);

    if (!user) {
      throw new AppError("Credenciais incorretas", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Credenciais incorretas", 401);
    }

    const token = sign({}, env.SECRET_TOKEN, {
      subject: user.id,
      expiresIn: "1d",
    });

    return token;
  }
}
