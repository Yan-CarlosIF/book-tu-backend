import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[PATCH] /categories/:id", () => {
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

  it("should be able to update a category", async () => {
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
      .patch(`/categories/${categories[0].id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Category 2",
      });

    const {
      body: { categories: updatedCategories },
    } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(204);
    expect(updatedCategories[0].name).toBe("Category 2");
  });

  it("should not be able to update a category if not authenticated", async () => {
    const {
      body: { categories },
    } = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .patch(`/categories/${categories[0].id}`)
      .send({
        name: "Category 2",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });

  it("should not be able to update a category if the category does not exist", async () => {
    const response = await request(app)
      .patch(`/categories/${v4()}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Category 2",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Category not found");
  });

  it("should not be able to update a category with a name that already exists", async () => {
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
      .patch(`/categories/${categories[0].id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Category 1",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Category already exists");
  });
});
