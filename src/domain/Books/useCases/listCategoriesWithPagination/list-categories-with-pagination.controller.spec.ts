import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";

describe("[GET] /categories", () => {
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

    for (let i = 0; i < 20; i++) {
      await request(app)
        .post("/categories")
        .send({
          name: `Category ${i + 1}`,
        })
        .set({
          Authorization: `Bearer ${token}`,
        });
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    const { body } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { total, categories } = body;

    expect(total).toBe(20);
    expect(categories.length).toBe(10);
    expect(categories).toEqual(
      Array.from({ length: 10 }, (_, i) => ({
        id: expect.any(String),
        name: `Category ${i + 1}`,
      }))
    );
  });

  it("should be able to list all categories with pagination", async () => {
    const { body } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .query({ page: 2 });

    const { total, categories } = body;

    expect(total).toBe(20);
    expect(categories.length).toBe(10);
    expect(categories).toEqual(
      Array.from({ length: 10 }, (_, i) => ({
        id: expect.any(String),
        name: `Category ${i + 11}`,
      }))
    );
  });

  it("should be able to filter categories by name", async () => {
    const { body } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .query({ search: "Category 10" });

    const { total, categories } = body;

    expect(total).toBe(1);
    expect(categories.length).toBe(1);
    expect(categories).toEqual([
      {
        id: expect.any(String),
        name: "Category 10",
      },
    ]);
  });

  it("should not be able to list all categories if user is not authenticated", async () => {
    const response = await request(app).get("/categories");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });
});
