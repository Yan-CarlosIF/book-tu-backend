import { User } from "../infra/typeorm/entities/User";

export class userMapper {
  static toMe({ id, login, name, permission, registration, role }: User) {
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
