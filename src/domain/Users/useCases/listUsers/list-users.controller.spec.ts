import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[GET] /users", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("123", 8);

    await connection.query(
      `INSERT INTO users(id, name, registration, login, password, role, permission)
        VALUES
        ('${v4()}', 'Random user', '153252fs', 'user-test', '${password}', 'user', 'admin');`
    );

    await connection.query(
      `INSERT INTO users(id, name, registration, login, password, role, permission)
        VALUES
        ('${v4()}', 'Random user', '15ssssss', 'user-operator', '${password}', 'user', 'operator');`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all users", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(2);
  });

  it("should be able to filter users by name or registration", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${token}` })
      .query({ search: "153252fs" });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.users[0].name).toBe("Random user");
    expect(response.body.users[0].registration).toBe("153252fs");

    const response2 = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${token}` })
      .query({ search: "Random user" });

    expect(response2.status).toBe(200);
    expect(response2.body.total).toBe(2);
    expect(response2.body.users[0].name).toBe("Random user");
    expect(response2.body.users[0].registration).toBe("153252fs");
  });

  it("should not be able to list all users if not authenticated", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });

  it("should not be able to list all users if token invalid", async () => {
    const response = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer invalid-token` });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token inválido");
  });

  it("should not be able to list all users if authenticated user is not admin", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-operator",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Usuário não tem permissão de admin");
  });
});
