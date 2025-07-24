import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IUpdateUserDTO } from "../../dto/Iupdate-user.dto";
import { IUsersRepository } from "../../repositories/Iusers.repository";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string, data: IUpdateUserDTO) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.permission && !["admin", "operator"].includes(data.permission)) {
      throw new AppError("Invalid permission", 400);
    }

    await this.usersRepository.update(user, data);
  }
}
