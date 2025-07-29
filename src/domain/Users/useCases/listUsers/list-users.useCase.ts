import { inject, injectable } from "tsyringe";

import { UserMapper } from "../../mapper/user.mapper";
import { IUsersRepository } from "../../repositories/Iusers.repository";

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(sort?: "asc" | "desc" | "operator" | "admin", page?: number) {
    if (!page || page < 1) {
      page = 1;
    }

    const users = await this.usersRepository.list(page, sort);

    return {
      users: users.data.map((user) => UserMapper.toViewUser(user)),
      page: users.page,
      lastPage: users.lastPage,
      total: users.total,
    };
  }
}
