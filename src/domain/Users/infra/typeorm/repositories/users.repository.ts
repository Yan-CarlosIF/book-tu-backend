import { IUsersRepository } from "domain/Users/repositories/Iusers.repository";
import { User } from "../entities/User";
import { getRepository, Repository } from "typeorm";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    id,
    login,
    name,
    password,
    permission,
    registration,
    role,
  }: User): Promise<void> {
    const user = this.repository.create({
      id,
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
