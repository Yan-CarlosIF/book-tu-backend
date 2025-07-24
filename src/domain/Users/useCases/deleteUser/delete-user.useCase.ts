import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IUsersRepository } from "../../repositories/Iusers.repository";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.usersRepository.delete(user);
  }
}
