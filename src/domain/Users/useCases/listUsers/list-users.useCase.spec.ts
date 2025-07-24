import { Permission } from "../../infra/typeorm/entities/User";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/users.repository-in-memory";
import { ListUsersUseCase } from "./list-users.useCase";

describe("[GET] /users", () => {
  let usersRepository: UsersRepositoryInMemory;
  let listUsersUseCase: ListUsersUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    listUsersUseCase = new ListUsersUseCase(usersRepository);
  });

  it("should be able to list all users", async () => {
    await usersRepository.create({
      login: "user-test",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    await usersRepository.create({
      login: "user-test2",
      name: "Random user",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    const users = await listUsersUseCase.execute();

    expect(users.length).toBe(2);
    expect(users[0]).toHaveProperty("id");
    expect(users[1]).toHaveProperty("id");
    expect(users[0]).not.toHaveProperty("password");
    expect(users[1]).not.toHaveProperty("password");
  });
});
