import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[GET] /inventories/:id", () => {
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

  it("should be able to get an inventory by id", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const response = await request(app)
      .get(`/inventories/${inventory.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(inventory.id);
  });

  it("should not be able to get an inventory if user is not authenticated", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const response = await request(app).get(`/inventories/${inventory.id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });

  it("should not be able to get an inventory with invalid id", async () => {
    const response = await request(app)
      .get(`/inventories/${v4()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Inventário não encontrado");
  });
});
