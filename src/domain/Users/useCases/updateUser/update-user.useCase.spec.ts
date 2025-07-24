import { v4 } from "uuid";

import { AppError } from "@/infra/errors/app-error";

import { Permission } from "../../infra/typeorm/entities/User";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/users.repository-in-memory";
import { UpdateUserUseCase } from "./update-user.useCase";

describe("[PATCH] /users/:id", () => {
  let usersRepository: UsersRepositoryInMemory;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    updateUserUseCase = new UpdateUserUseCase(usersRepository);
  });

  it("should be able to edit user data", async () => {
    await usersRepository.create({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    const user = await usersRepository.findByLogin("user-test");

    await updateUserUseCase.execute(user!.id, {
      name: "user random",
      login: "user",
      registration: "4321",
      permission: Permission.ADMIN,
      role: "chief",
    });

    const userUpdated = await usersRepository.findByLogin("user");

    expect(userUpdated).toMatchObject({
      id: user!.id,
      name: "user random",
      login: "user",
      password: user!.password,
      registration: "4321",
      permission: Permission.ADMIN,
      role: "chief",
    });
  });

  it("should not be able to edit user data if user does not exist", async () => {
    await expect(
      updateUserUseCase.execute(v4(), {
        name: "user random",
        login: "user",
        registration: "4321",
        permission: Permission.ADMIN,
        role: "chief",
      })
    ).rejects.toEqual(new AppError("User not found", 404));
  });
});
