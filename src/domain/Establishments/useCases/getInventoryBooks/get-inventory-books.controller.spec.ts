import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[GET] /inventories/:id/books", () => {
  let connection: Connection;
  let token: string;

  beforeAll(async () => {
    connection = await seed();

    const responseAuth = await request(app).post("/auth/session").send({
      login: "admin-test",
      password: "123",
    });

    token = responseAuth.body.token;
  });

  afterAll(async () => {
    if (connection) {
      await connection.dropDatabase();
      await connection.close();
    }
  });

  it("should be able to get books from an inventory", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const response = await request(app)
      .get(`/inventories/${inventory.id}/books`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.books.length).toBeGreaterThan(0);
    expect(response.body.total).toBeGreaterThan(0);
    expect(response.body.page).toBe(1);
  });

  it("should not be able to get books from an inventory that does not exist", async () => {
    const response = await request(app)
      .get(`/inventories/${v4()}/books`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Inventário não encontrado");
  });

  it("should not be able to get books from an inventory if user is not authenticated", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const response = await request(app).get(
      `/inventories/${inventory.id}/books`
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });
});
