import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[GET] /books/:id", () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get a book", async () => {
    await request(app)
      .post("/books")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: "Book 1",
        author: "Author 1",
        description: "Description 1",
        categoryIds: [],
        release_year: 2000,
        price: 10,
      });

    const [{ id }] = await connection.query(
      `SELECT id FROM books WHERE title = 'Book 1'`
    );

    const response = await request(app)
      .get(`/books/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.title).toBe("Book 1");
  });

  it("should not be able to get a book that does not exists", async () => {
    const response = await request(app)
      .get(`/books/${v4()}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });

  it("should not be able to get a book if not authenticated", async () => {
    const response = await request(app).get(`/books/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });
});
