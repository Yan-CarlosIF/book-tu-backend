import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { ICreateUserDTO } from "../../dto/Icreate-user.dto";
import { IUsersRepository } from "../../repositories/Iusers.repository";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(data: ICreateUserDTO) {
    const userWithSameLogin = await this.usersRepository.findByLogin(
      data.login
    );

    if (userWithSameLogin) {
      throw new AppError("User already exists", 409);
    }

    const userWithSameRegistration =
      await this.usersRepository.findByRegistration(data.registration);

    if (userWithSameRegistration) {
      throw new AppError("Registration already exists", 409);
    }

    await this.usersRepository.create(data);
  }
}
