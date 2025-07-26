import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[PATCH] /books/:id", () => {
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

  it("should be able to update a book", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    await request(app)
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

    const {
      body: { books },
    } = await request(app)
      .get("/books")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id } = books[0];

    const response = await request(app)
      .patch(`/books/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Book 2",
        author: "Author 2",
        release_year: 2001,
        price: 20,
        description: "Description 2",
      });

    const {
      body: { books: updatedBooks },
    } = await request(app)
      .get("/books")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(updatedBooks[0].id).toBe(id);
    expect(updatedBooks[0].title).toBe("Book 2");
    expect(updatedBooks[0].author).toBe("Author 2");
    expect(updatedBooks[0].release_year).toBe(2001);
    expect(updatedBooks[0].description).toBe("Description 2");

    expect(response.status).toBe(204);
  });

  it("should not be able to update a book if the book does not exist", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const response = await request(app)
      .patch(`/books/${v4()}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Book 2",
        author: "Author 2",
        release_year: 2001,
        price: 20,
        description: "Description 2",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Book not found");
  });

  it("should not be able to update a book if the category does not exist", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const {
      body: { books },
    } = await request(app)
      .get("/books")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id } = books[0];

    const response = await request(app)
      .patch(`/books/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Book 2",
        author: "Author 2",
        release_year: 2001,
        price: 20,
        description: "Description 2",
        categoryIds: [v4()],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("One or more categories not found");
  });

  it("should not be able to update a book if not authenticated", async () => {
    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "123",
    });

    const { token } = responseAuth.body;

    const {
      body: { books },
    } = await request(app)
      .get("/books")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id } = books[0];

    const response = await request(app).patch(`/books/${id}`).send({
      title: "Book 2",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });
});
