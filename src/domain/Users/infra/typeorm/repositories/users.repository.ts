import { hash } from "bcryptjs";
import { Brackets, getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "@/domain/Users/dto/Icreate-user.dto";
import { IUpdateUserDTO } from "@/domain/Users/dto/Iupdate-user.dto";
import { IUsersPaginationData } from "@/domain/Users/dto/Iusers-pagination-data.dto";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";
import { pagination } from "@/utils/pagination";

import { Permission, User } from "../entities/User";

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

  async list(
    page: number,
    sort?: string,
    search?: string
  ): Promise<IUsersPaginationData> {
    const queryBuilder = this.repository.createQueryBuilder("users");

    if (search) {
      const likeSearch = `%${search}%`;

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("users.name ILIKE :search", { search: likeSearch }).orWhere(
            "users.registration ILIKE :search",
            { search: likeSearch }
          );
        })
      );
    }

    switch (sort) {
      case "asc":
        queryBuilder.orderBy("users.name", "ASC");
        break;
      case "desc":
        queryBuilder.orderBy("users.name", "DESC");
        break;
      case "operator":
        queryBuilder.where("users.permission = 'operator'");
        break;
      case "admin":
        queryBuilder.where("users.permission = 'admin'");
        break;
    }

    return await pagination<User>(queryBuilder, page, 10);
  }

  async update(
    user: User,
    { login, name, permission, registration, role }: IUpdateUserDTO
  ): Promise<void> {
    await this.repository.update(user.id, {
      login: login ?? user.login,
      name: name ?? user.name,
      registration: registration ?? user.registration,
      role: role ?? user.role,
      permission: (permission as Permission) ?? user.permission,
    });
  }

  async delete(user: User): Promise<void> {
    await this.repository.delete(user.id);
  }
}
