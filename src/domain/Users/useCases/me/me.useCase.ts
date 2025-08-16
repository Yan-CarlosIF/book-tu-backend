import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IUsersRepository } from "../../repositories/Iusers.repository";

@injectable()
export class MeUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError("Não autorizado", 401);
    }

    return user;
  }
}
