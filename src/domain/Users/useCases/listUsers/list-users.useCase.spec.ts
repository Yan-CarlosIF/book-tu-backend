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

    const { users, total } = await listUsersUseCase.execute();

    expect(total).toBe(2);
    expect(users[0]).toHaveProperty("id");
    expect(users[1]).toHaveProperty("id");
    expect(users[0]).not.toHaveProperty("password");
    expect(users[1]).not.toHaveProperty("password");
  });

  it("should be able to list all users with pagination", async () => {
    for (let i = 0; i < 20; i++) {
      await usersRepository.create({
        login: `user-test-${i + 1}`,
        name: "Random user",
        password: "123",
        permission: Permission.OPERATOR,
        registration: `registration-test-${i + 1}`,
        role: "user",
      });
    }

    const { users, total } = await listUsersUseCase.execute(undefined, 1);

    expect(total).toBe(20);
    expect(users.length).toBe(10);
    expect(users[0]).toHaveProperty("id");
    expect(users[9]).toHaveProperty("id");
  });

  it("should be able to list all users with filters", async () => {
    await usersRepository.create({
      login: "user-test1",
      name: "Yan",
      password: "123",
      permission: Permission.OPERATOR,
      registration: "153252fs",
      role: "user",
    });

    await usersRepository.create({
      login: "user-test2",
      name: "Mairon",
      password: "123",
      permission: Permission.ADMIN,
      registration: "153252",
      role: "user",
    });

    const { users, total } = await listUsersUseCase.execute("asc");

    expect(total).toBe(2);
    expect(users[0].name).toBe("Mairon");
    expect(users[1].name).toBe("Yan");

    const { users: users2, total: total2 } = await listUsersUseCase.execute(
      "desc"
    );

    expect(total2).toBe(2);
    expect(users2[0].name).toBe("Yan");
    expect(users2[1].name).toBe("Mairon");

    const { users: users3, total: total3 } = await listUsersUseCase.execute(
      "admin"
    );

    expect(total3).toBe(1);
    expect(users3[0].name).toBe("Mairon");
    expect(users3[0].permission).toBe(Permission.ADMIN);

    const { users: users4, total: total4 } = await listUsersUseCase.execute(
      "operator"
    );

    expect(total4).toBe(1);
    expect(users4[0].name).toBe("Yan");
    expect(users4[0].permission).toBe(Permission.OPERATOR);
  });

  it("should be able to list last page if page is greater than last page", async () => {
    for (let i = 0; i < 20; i++) {
      await usersRepository.create({
        login: `user-test-${i + 1}`,
        name: "Random user",
        password: "123",
        permission: Permission.OPERATOR,
        registration: `registration-test-${i + 1}`,
        role: "user",
      });
    }

    const { page } = await listUsersUseCase.execute(undefined, 10000);

    expect(page).toBe(2);
  });
});
