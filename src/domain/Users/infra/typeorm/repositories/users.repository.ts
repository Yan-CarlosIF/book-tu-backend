import { ICreateUserDTO } from "domain/Users/dto/Icreate-user.dto";
import { IUsersRepository } from "domain/Users/repositories/Iusers.repository";
import { getRepository, Repository } from "typeorm";

import { User } from "../entities/User";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    login,
    name,
    password,
    permission,
    registration,
    role,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      login,
      name,
      password,
      permission,
      registration,
      role,
    });

    await this.repository.save(user);
  }
}
