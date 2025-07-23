import { UsersRepository } from "domain/Users/infra/typeorm/repositories/users.repository";
import { IUsersRepository } from "domain/Users/repositories/Iusers.repository";
import { container } from "tsyringe";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);
