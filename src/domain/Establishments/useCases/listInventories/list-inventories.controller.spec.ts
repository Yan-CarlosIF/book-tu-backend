import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[GET] /inventories", () => {
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

  it("should be able to list inventories with pagination", async () => {
    const response = await request(app)
      .get("/inventories")
      .query({ page: 1 })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.total).toBeGreaterThan(0);
  });

  it("should not be able to list inventories if user is not authenticated", async () => {
    const response = await request(app).get("/inventories");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });
});
