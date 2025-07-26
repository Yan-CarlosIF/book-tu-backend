import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[DELETE] /categories/:id", () => {
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
       ('${id}', 'Random user', '153252fs', 'user-test', '${password}', 'user', 'admin');`
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

  it("should be able to delete a category", async () => {
    await request(app)
      .post("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Category 1",
      });

    const {
      body: { categories },
    } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .delete(`/categories/${categories[0].id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const {
      body: { categories: updatedCategories },
    } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(updatedCategories.length).toBe(0);
    expect(response.status).toBe(200);
  });

  it("should not be able to delete a category that does not exist", async () => {
    const response = await request(app)
      .delete(`/categories/${v4()}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Category not found");
  });

  it("should not be able to delete a category without authentication", async () => {
    const response = await request(app).delete(`/categories/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });

  it("should not be able to delete a category if user is not admin", async () => {
    await request(app)
      .post("/users")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "operator",
        registration: "random-registration",
        login: "user-operator",
        password: "123",
        role: "user",
        permission: "operator",
      });

    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-operator",
      password: "123",
    });

    const { token: tokenOperator } = responseAuth.body;

    await request(app)
      .post("/categories")
      .set({
        Authorization: `Bearer ${tokenOperator}`,
      })
      .send({
        name: "Category 1",
      });

    const {
      body: { categories },
    } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${tokenOperator}`,
      });

    const response = await request(app)
      .delete(`/categories/${categories[0].id}`)
      .set({
        Authorization: `Bearer ${tokenOperator}`,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("User does not have permission");
  });
});
