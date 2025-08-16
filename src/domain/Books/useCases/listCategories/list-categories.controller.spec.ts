import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[GET] /categories/all", () => {
  let connection: Connection;
  let token: string;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("123", 8);
    const id = v4();

    await connection.query(
      `INSERT INTO users(id, name, registration, login, password, role, permission)
       VALUES
       ('${id}', 'Random user', '153252fs', 'user-test', '${password}', 'user', 'operator');`
    );

    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    token = responseAuth.body.token;

    for (let i = 0; i < 10; i++) {
      await request(app)
        .post("/categories")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: `Category ${i + 1}`,
        });
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    const response = await request(app)
      .get("/categories/all")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
  });

  it("should not be able to list all categories without authentication", async () => {
    const response = await request(app).get("/categories/all");

    expect(response.body.message).toEqual("Usuário não autenticado");
  });
});
