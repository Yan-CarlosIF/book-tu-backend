import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[GET] /stocks", () => {
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

  it("should be able to list stock items with pagination", async () => {
    const response = await request(app)
      .get("/stocks")
      .query({ page: 1 })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should not be able to list stock items if user is not authenticated", async () => {
    const response = await request(app).get("/stocks");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });

  it("should be able to list stock items per establishment", async () => {
    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments LIMIT 1`
    );

    const response = await request(app)
      .get("/stocks")
      .query({ page: 1, establishmentId })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(10);
    expect(response.body.data[0].stock.establishment_id).toEqual(
      establishmentId
    );
  });
});
