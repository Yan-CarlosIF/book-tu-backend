import { AppError } from "@/infra/errors/app-error";

import { Permission } from "../../infra/typeorm/entities/User";
import { UserMapper } from "../../mapper/user.mapper";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/users.repository-in-memory";
import { MeUseCase } from "./me.useCase";

describe("[GET] /users/me", () => {
  let usersRepository: UsersRepositoryInMemory;
  let meUseCase: MeUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    meUseCase = new MeUseCase(usersRepository);
  });

  it("should be able to get the authenticated user", async () => {
    await usersRepository.create({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    const user = await usersRepository.findByLogin("user-test");

    const response = await meUseCase.execute(user!.id);

    expect(response).toMatchObject(UserMapper.toViewUser(user!));
  });

  it("should not be able to get the authenticated user if not authenticated", async () => {
    await expect(meUseCase.execute("invalid-id")).rejects.toEqual(
      new AppError("Unauthorized", 401)
    );
  });
});
