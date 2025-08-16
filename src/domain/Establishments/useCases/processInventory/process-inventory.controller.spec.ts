import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[POST] /inventories/process/:id", () => {
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

  it("should be able to process inventory", async () => {
    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments LIMIT 1`
    );

    const [{ id: inventoryId }] = await connection.query(
      `SELECT id FROM inventories WHERE establishment_id = '${establishmentId}' LIMIT 1`
    );

    const response = await request(app)
      .post(`/inventories/process/${inventoryId}`)
      .set({ Authorization: `Bearer ${token}` });

    const { body: inventory } = await request(app)
      .get(`/inventories/${inventoryId}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const [{ sum: totalQuantity }] = await connection.query(
      `select sum(quantity)
      from stocks join stock_items
      on stocks.id = stock_items.stock_id
      where stocks.establishment_id = '${establishmentId}'
      group by stock_id;`
    );

    expect(response.status).toBe(200);
    expect(inventory.status).toBe("processed");
    expect(Number(totalQuantity)).toBe(inventory.total_quantity);
  });

  it("should not be able to process inventory if user is not authenticated", async () => {
    const [{ id: inventoryId }] = await connection.query(
      `SELECT id FROM inventories LIMIT 1`
    );

    const response = await request(app).post(
      `/inventories/process/${inventoryId}`
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });

  it("should not be able to process inventory if inventory does not exists", async () => {
    const response = await request(app)
      .post(`/inventories/process/${v4()}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Inventário não encontrado");
  });

  it("should not be able to process a inventory if user is not admin", async () => {
    const [{ id: inventoryId }] = await connection.query(
      `SELECT id FROM inventories LIMIT 1`
    );

    const {
      body: { token: tokenOperator },
    } = await request(app).post("/auth/session").send({
      login: "yanzin",
      password: "123",
    });

    const response = await request(app)
      .post(`/inventories/process/${inventoryId}`)
      .set({ Authorization: `Bearer ${tokenOperator}` });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Usuário não tem permissão de admin");
  });

  it("should not be able to process a inventory if inventory is already processed", async () => {
    const [{ id: inventoryId }] = await connection.query(
      `SELECT id FROM inventories WHERE status = 'processed' LIMIT 1`
    );

    const response = await request(app)
      .post(`/inventories/process/${inventoryId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Inventário já processado");
  });
});
