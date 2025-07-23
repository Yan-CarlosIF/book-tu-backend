import { User } from "../infra/typeorm/entities/User";

type CreateUserDTO = Omit<User, "id" | "role">;

export interface ICreateUserDTO extends CreateUserDTO {
  role?: string;
}
