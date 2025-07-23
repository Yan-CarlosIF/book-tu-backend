import { hash } from "bcryptjs";

import { ICreateUserDTO } from "@/domain/Users/dto/Icreate-user.dto";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";

import { User } from "../../infra/typeorm/entities/User";

export class UsersRepositoryInMemory implements IUsersRepository {
  private users: User[] = [];

  async create(data: ICreateUserDTO): Promise<void> {
    const user = new User();

    const hashedPassword = await hash(data.password, 8);

    Object.assign(user, {
      ...data,
      password: hashedPassword,
    });

    this.users.push(user);
  }

  async findByLogin(login: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.login === login);

    return user;
  }
}
