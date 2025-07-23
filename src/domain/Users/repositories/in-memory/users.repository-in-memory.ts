import { ICreateUserDTO } from "domain/Users/dto/Icreate-user.dto";
import { IUsersRepository } from "domain/Users/repositories/Iusers.repository";

import { User } from "../../infra/typeorm/entities/User";

export class UsersRepositoryInMemory implements IUsersRepository {
  private users: User[] = [];

  async create(data: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      ...data,
    });

    this.users.push(user);
  }
}
