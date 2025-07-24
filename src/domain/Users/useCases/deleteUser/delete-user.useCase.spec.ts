import { v4 } from "uuid";

import { AppError } from "@/infra/errors/app-error";

import { Permission } from "../../infra/typeorm/entities/User";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/users.repository-in-memory";
import { DeleteUserUseCase } from "./delete-user.useCase";

describe("[DELETE] /users/:id", () => {
  let usersRepository: UsersRepositoryInMemory;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    deleteUserUseCase = new DeleteUserUseCase(usersRepository);
  });

  it("should be able to delete a user", async () => {
    await usersRepository.create({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: "operator" as Permission,
      registration: "153252fs",
      role: "user",
    });

    const user = await usersRepository.findByLogin("user-test");

    await deleteUserUseCase.execute(user!.id);
  });

  it("should not be able to delete a user that does not exist", async () => {
    await expect(deleteUserUseCase.execute(v4())).rejects.toEqual(
      new AppError("User not found", 404)
    );
  });
});
