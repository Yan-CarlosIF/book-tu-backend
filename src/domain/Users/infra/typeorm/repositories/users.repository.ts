import { hash } from "bcryptjs";
import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "@/domain/Users/dto/Icreate-user.dto";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";

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
    const hashedPassword = await hash(password, 8);

    const user = this.repository.create({
      login,
      name,
      password: hashedPassword,
      permission,
      registration,
      role,
    });

    await this.repository.save(user);
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return await this.repository.findOne({ login });
  }

  async findByRegistration(registration: string): Promise<User | undefined> {
    return await this.repository.findOne({ registration });
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }
}
