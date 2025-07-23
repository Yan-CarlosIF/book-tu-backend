import { ICreateUserDTO } from "../dto/Icreate-user.dto";

export interface IUsersRepository {
  create(user: ICreateUserDTO): Promise<void>;
}
