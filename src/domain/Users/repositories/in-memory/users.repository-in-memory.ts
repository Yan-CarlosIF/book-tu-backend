import { hash } from "bcryptjs";

import { ICreateUserDTO } from "@/domain/Users/dto/Icreate-user.dto";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";

import { IUpdateUserDTO } from "../../dto/Iupdate-user.dto";
import { IUsersPaginationData } from "../../dto/Iusers-pagination-data.dto";
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

  async list(
    page: number,
    sort?: string,
    search?: string
  ): Promise<IUsersPaginationData> {
    let users = this.users;

    if (search) {
      users = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.registration.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case "asc":
        users = this.users.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "desc":
        users = this.users.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "operator":
        users = this.users.filter((u) => u.permission === Permission.OPERATOR);
        break;
      case "admin":
        users = this.users.filter((u) => u.permission === Permission.ADMIN);
        break;
    }

    const lastPage = Math.ceil(users.length / 10);

    if (page > lastPage) {
      page = lastPage;
    }

    return {
      data: users.slice((page - 1) * 10, page * 10),
      page,
      total: users.length,
      lastPage,
    };
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
