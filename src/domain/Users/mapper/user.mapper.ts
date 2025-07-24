import { User } from "../infra/typeorm/entities/User";

export type UserView = Omit<User, "password">;

export class UserMapper {
  static toViewUser({
    id,
    login,
    name,
    permission,
    registration,
    role,
  }: User): UserView {
    return {
      id,
      name,
      registration,
      login,
      role,
      permission,
    };
  }
}
