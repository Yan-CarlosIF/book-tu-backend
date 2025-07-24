import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[DELETE] /users/:id", () => {
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

  it("should be able to delete a user", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    await request(app)
      .post("/users")
      .set({
        authorization: `Bearer ${responseAuth.body.token}`,
      })
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
      .delete(`/users/${userId}`)
      .set({
        authorization: `Bearer ${token}`,
      });

    const { body: users } = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(204);
    expect(users.length).toBe(1);
  });

  it("should not be able to delete yourself", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const [{ id: userId }] = await connection.query(
      `SELECT id FROM users WHERE login = 'user-test'`
    );

    const response = await request(app)
      .delete(`/users/${userId}`)
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("You cannot delete yourself");
  });

  it("should not be able to delete a user if not authenticated", async () => {
    const response = await request(app).delete(`/users/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });

  it("should not be able to delete a user if token invalid", async () => {
    const response = await request(app)
      .delete(`/users/${v4()}`)
      .set({ Authorization: `Bearer invalid-token` });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  it("should not be able to delete a user if authenticated user is not admin", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    await request(app)
      .post("/users")
      .set({
        authorization: `Bearer ${token}`,
      })
      .send({
        login: "user-operator",
        name: "Random user",
        password: "123",
        permission: "operator",
        registration: "random-registration",
        role: "user",
      });

    const responseAuthOperator = await request(app).post("/auth/session").send({
      login: "user-operator",
      password: "123",
    });

    const { token: tokenOperator } = responseAuthOperator.body;

    const response = await request(app)
      .delete(`/users/${v4()}`)
      .set({ Authorization: `Bearer ${tokenOperator}` });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("User does not have permission");
  });
});
