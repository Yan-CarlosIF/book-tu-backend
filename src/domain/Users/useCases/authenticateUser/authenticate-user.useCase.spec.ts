import { verify } from "jsonwebtoken";

import { env } from "@/config/env";
import { Permission } from "@/domain/Users/infra/typeorm/entities/User";
import { UsersRepositoryInMemory } from "@/domain/Users/repositories/in-memory/users.repository-in-memory";
import { AppError } from "@/infra/errors/app-error";

import { AuthenticateUserUseCase } from "./authenticate-user.useCase";

describe("[POST] /auth/session", () => {
  let usersRepository: UsersRepositoryInMemory;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate a user", async () => {
    await usersRepository.create({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    const user = await usersRepository.findByLogin("user-test");

    const token = await authenticateUserUseCase.execute({
      login: "user-test",
      password: "123",
    });

    expect(verify(token, env.SECRET_TOKEN)).toEqual({
      exp: expect.any(Number),
      iat: expect.any(Number),
      sub: user!.id,
    });
  });

  it("should not be able to authenticate a non-existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        login: "user-test",
        password: "123",
      })
    ).rejects.toEqual(new AppError("User not found", 404));
  });

  it("should not be able to authenticate with incorrect password", async () => {
    await usersRepository.create({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    await expect(
      authenticateUserUseCase.execute({
        login: "user-test",
        password: "1234",
      })
    ).rejects.toEqual(new AppError("Incorrect password", 401));
  });
});
