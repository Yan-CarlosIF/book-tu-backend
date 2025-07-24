import { inject, injectable } from "tsyringe";

import { UserMapper } from "../../mapper/user.mapper";
import { IUsersRepository } from "../../repositories/Iusers.repository";

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute() {
    return (await this.usersRepository.list()).map((user) =>
      UserMapper.toViewUser(user)
    );
  }
}
