import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[GET] /books", () => {
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
        .post("/books")
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({
          title: `Random book ${i + 1}`,
          identifier: `123${i + 1}`,
          author: `Random author ${i + 1}`,
          publisher: `Random publisher ${i + 1}`,
          release_year: 2000 + i,
          price: 10 + i,
          description: `Random description ${i + 1}`,
          categoryIds: [],
        });
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all books", async () => {
    const {
      body: { total },
    } = await request(app)
      .get("/books")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(total).toBe(20);
  });

  it("should be able to list all books with pagination", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const { body } = await request(app)
      .get("/books")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .query({ page: 2 });

    expect(body.books.length).toBe(10);
    expect(body.total).toBe(20);
    expect(body.page).toBe(2);
  });
});
