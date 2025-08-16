import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[PATCH] /users/:id", () => {
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

  it("should be able to edit user data", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    await request(app)
      .post("/users")
      .set({ authorization: `Bearer ${token}` })
      .send({
        login: "user-test2",
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: "random-registration",
        role: "user",
      });

    const [{ id: userId }] = await connection.query(
      `SELECT id FROM users WHERE login = 'user-test2'`
    );

    const response = await request(app)
      .patch(`/users/${userId}`)
      .set({
        authorization: `Bearer ${token}`,
      })
      .send({
        login: "user-test3",
      });

    const { body } = await request(app)
      .get("/users")
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(body.users[1].login).toBe("user-test3");
    expect(response.status).toBe(204);
  });

  it("should not be able to edit user data if token invalid", async () => {
    const response = await request(app)
      .patch(`/users/${v4()}`)
      .set({
        authorization: `Bearer invalid-token`,
      })
      .send({
        login: "user-test3",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token inválido");
  });

  it("should not be able to edit user data if authenticated user is not admin", async () => {
    const responseAuthAdmin = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuthAdmin.body;

    await request(app)
      .post("/users")
      .set({ authorization: `Bearer ${token}` })
      .send({
        login: "user-operator",
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: "131331",
        role: "user",
      });

    const responseAuthOperator = await request(app).post("/auth/session").send({
      login: "user-operator",
      password: "123",
    });

    const { token: tokenOperator } = responseAuthOperator.body;

    const response = await request(app)
      .patch(`/users/${v4()}`)
      .set({
        authorization: `Bearer ${tokenOperator}`,
      })
      .send({
        login: "user-test3",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Usuário não tem permissão de admin");
  });

  it("should not be able to edit user data if user does not exist", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .patch(`/users/${v4()}`)
      .set({
        authorization: `Bearer ${token}`,
      })
      .send({
        login: "user-test3",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado");
  });
});
