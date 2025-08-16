import { AppError } from "@/infra/errors/app-error";

import { Permission } from "../../infra/typeorm/entities/User";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/users.repository-in-memory";
import { CreateUserUseCase } from "./create-user.useCase";

describe("[POST] /users", () => {
  let usersRepository: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    await createUserUseCase.execute({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    const user = await usersRepository.findByLogin("user-test");

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same login", async () => {
    await createUserUseCase.execute({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    await expect(
      createUserUseCase.execute({
        login: "user-test",
        name: "Random user",
        password: "123",
        permission: Permission.OPERATOR,
        registration: "153252fs",
        role: "user",
      })
    ).rejects.toEqual(
      new AppError("Usuário já cadastrado com esse login", 409)
    );
  });

  it("should not be able to create a new user with same registration", async () => {
    await createUserUseCase.execute({
      login: "user-test1",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    await expect(
      createUserUseCase.execute({
        login: "user-test2",
        name: "Random user",
        password: "123",
        permission: Permission.OPERATOR,
        registration: "153252fs",
        role: "user",
      })
    ).rejects.toEqual(
      new AppError("Usuário já cadastrado com essa matricula", 409)
    );
  });
});
