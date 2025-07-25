import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[POST] /books", () => {
  let connection: Connection;

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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new book", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .post("/books")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Book 1",
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categoryIds: [],
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create a new book with a categories", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    await request(app)
      .post("/categories")
      .send({
        name: "Category 1",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const [{ id: categoryId }] = await connection.query(
      `SELECT id FROM categories WHERE name = 'Category 1'`
    );

    const response = await request(app)
      .post("/books")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Book 1",
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categoryIds: [categoryId],
      });

    const [category] = await connection.query(
      `SELECT categories.id, categories.name
       FROM books JOIN book_categories
       ON books.id = book_categories.book_id
       JOIN categories
       ON book_categories.category_id = categories.id
       WHERE books.title = 'Book 1'`
    );

    expect(category.name).toBe("Category 1");
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new book with a category if the category does not exist", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .post("/books")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Book 1",
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categoryIds: [v4()],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("One or more categories not found");
  });

  it("should not be able to create a new book with a category without authentication", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Book 1",
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categoryIds: [v4()],
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });
});
