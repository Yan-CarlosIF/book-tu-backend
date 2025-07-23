import { container } from "tsyringe";

import { UsersRepository } from "@/domain/Users/infra/typeorm/repositories/users.repository";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);
