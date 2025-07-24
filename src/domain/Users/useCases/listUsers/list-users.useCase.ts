import { inject, injectable } from "tsyringe";

import { pagination } from "@/utils/pagination";

import { UserMapper, UserView } from "../../mapper/user.mapper";
import { IUsersRepository } from "../../repositories/Iusers.repository";

interface IResponse {
  data: UserView[];
  total: number;
  page: number;
  lastPage: number;
}

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(
    sort?: "asc" | "desc" | "operator" | "admin",
    page?: number
  ): Promise<IResponse> {
    const allUsers = (await this.usersRepository.list()).map((user) =>
      UserMapper.toViewUser(user)
    );

    let users = allUsers;
    switch (sort) {
      case "asc":
        users = users.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "desc":
        users = users.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "operator":
        users = users.filter((user) => user.permission === "operator");
        break;
      case "admin":
        users = users.filter((user) => user.permission === "admin");
        break;
    }

    if (!page) {
      page = 1;
    }

    return pagination<UserView>(users, page, 10);
  }
}
