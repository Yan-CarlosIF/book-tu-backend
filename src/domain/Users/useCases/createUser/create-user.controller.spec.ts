import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[POST] /users", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("123", 8);
    const id = v4();

    await connection.query(
      `INSERT INTO users(id, name, registration, login, password, role, permission)
       VALUES
       ('${id}', 'Random user', '153252fs', 'user-test', '${password}', 'user', 'admin');`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .post("/users")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        login: "user-test2",
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: "random-registration",
        role: "user",
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a user if the creator is not admin", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token: tokenAdmin } = responseAuth.body;

    await request(app)
      .post("/users")
      .set({ Authorization: `Bearer ${tokenAdmin}` })
      .send({
        login: "user-operator",
        name: "Random user",
        password: "1234",
        permission: "operator",
        registration: "random",
        role: "user",
      });

    const responseAuthOperator = await request(app).post("/auth/session").send({
      login: "user-operator",
      password: "1234",
    });

    const { token: tokenOperator } = responseAuthOperator.body;

    const response = await request(app)
      .post("/users")
      .set({ Authorization: `Bearer ${tokenOperator}` })
      .send({
        login: "user-test3",
        name: "Random user",
        password: "1234",
        permission: "operator",
        registration: "random",
        role: "user",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("User does not have permission");
  });

  it("should not be able to create a new user with same login", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .post("/users")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        login: "user-test",
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: "random-registration",
        role: "user",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already exists");
  });

  it("should not be able to create a new user with same registration", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .post("/users")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        login: "user-test5",
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: "153252fs",
        role: "user",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Registration already exists");
  });

  it("should not be able to create a new user if not authenticated", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        login: `user-test-${v4()}`,
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: v4(),
        role: "user",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });

  it("should not be able to create a new user if token invalid", async () => {
    const response = await request(app)
      .post("/users")
      .set({ Authorization: `Bearer invalid-token` })
      .send({
        login: `user-test-${v4()}`,
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: v4(),
        role: "user",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});
