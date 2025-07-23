import { User } from "../infra/typeorm/entities/User";

export interface IUsersRepository {
  create(user: User): Promise<void>;
}
