import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[PUT] /inventories/:id", () => {
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

  it("should be able to update a inventory", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const [book] = await connection.query(`SELECT * FROM books LIMIT 1`);

    const response = await request(app)
      .put(`/inventories/${inventory.id}`)
      .send({
        inventoryBooks: [
          {
            book_id: book.id,
            quantity: 5,
          },
        ],
      })
      .set({ Authorization: `Bearer ${token}` });

    const [updatedInventory] = await connection.query(
      `SELECT * FROM inventories WHERE id = '${inventory.id}'`
    );

    expect(response.status).toBe(200);
    expect(updatedInventory.total_quantity).toBe(5);
  });

  it("should not be able to update a inventory if user is not authenticated", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const [book] = await connection.query(`SELECT * FROM books LIMIT 1`);

    const response = await request(app)
      .put(`/inventories/${inventory.id}`)
      .send({
        inventoryBooks: [
          {
            book_id: book.id,
            quantity: 5,
          },
        ],
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not found");
  });

  it("should not be able to update a inventory if inventory does not exist", async () => {
    const response = await request(app)
      .put(`/inventories/${v4()}`)
      .send({
        inventoryBooks: [],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Inventário não encontrado");
  });

  it("should not be able to update a inventory if some book does not exist", async () => {
    const [inventory] = await connection.query(
      `SELECT * FROM inventories LIMIT 1`
    );

    const [book] = await connection.query(`SELECT * FROM books LIMIT 1`);

    const response = await request(app)
      .put(`/inventories/${inventory.id}`)
      .send({
        inventoryBooks: [
          {
            book_id: v4(),
            quantity: 5,
          },
          {
            book_id: book.id,
            quantity: 5,
          },
        ],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message.normalize("NFC")).toEqual(
      "Um ou mais livros não são válidos".normalize("NFC")
    );
  });
});
