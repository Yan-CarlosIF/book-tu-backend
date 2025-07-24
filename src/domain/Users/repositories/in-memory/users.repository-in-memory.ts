import { hash } from "bcryptjs";

import { ICreateUserDTO } from "@/domain/Users/dto/Icreate-user.dto";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";

import { IUpdateUserDTO } from "../../dto/Iupdate-user.dto";
import { Permission, User } from "../../infra/typeorm/entities/User";

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

  async findByRegistration(registration: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.registration === registration);

    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);

    return user;
  }

  async list(): Promise<User[]> {
    return this.users;
  }

  async update(user: User, data: IUpdateUserDTO): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
      permission:
        data.permission === "admin" ? Permission.ADMIN : Permission.OPERATOR,
    };
  }

  async delete(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);

    this.users.splice(userIndex, 1);
  }
}
