import { inject, injectable } from "tsyringe";

import { UserMapper } from "../../mapper/user.mapper";
import { IUsersRepository } from "../../repositories/Iusers.repository";

type usersSortOptions = "asc" | "desc" | "operator" | "admin";

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(sort?: usersSortOptions, page?: number, search?: string) {
    if (!page || page < 1) {
      page = 1;
    }

    const users = await this.usersRepository.list(page, sort, search);

    return {
      users: users.data.map((user) => UserMapper.toViewUser(user)),
      page: users.page,
      lastPage: users.lastPage,
      total: users.total,
    };
  }
}
