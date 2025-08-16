import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[DELETE] /inventories/:id", () => {
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

  it("should be able to delete inventory", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const response = await request(app)
      .delete(`/inventories/${inventory.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const inventories = await connection.query(
      `SELECT * FROM inventories WHERE id = '${inventory.id}'`
    );

    expect(inventories.length).toBe(0);
    expect(response.status).toBe(204);
  });

  it("should not be able to delete inventory if user is not authenticated", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const response = await request(app).delete(`/inventories/${inventory.id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });

  it("should not be able to delete inventory if inventory does not exist", async () => {
    const response = await request(app)
      .delete(`/inventories/${v4()}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Inventário não encontrado");
  });
});
