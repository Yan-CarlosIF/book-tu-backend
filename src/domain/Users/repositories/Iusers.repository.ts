import { ICreateUserDTO } from "../dto/Icreate-user.dto";
import { IUpdateUserDTO } from "../dto/Iupdate-user.dto";
import { User } from "../infra/typeorm/entities/User";

export interface IUsersRepository {
  create(user: ICreateUserDTO): Promise<void>;
  findByLogin(login: string): Promise<User | undefined>;
  findByRegistration(registration: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  list(): Promise<User[]>;
  update(user: User, data: IUpdateUserDTO): Promise<void>;
  delete(user: User): Promise<void>;
}
