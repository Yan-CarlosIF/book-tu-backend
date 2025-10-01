import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[POST] /inventories/sync", () => {
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

  it("should be able to sync inventory", async () => {
    const [book] = await connection.query(`SELECT * FROM books LIMIT 1`);
    const [establishment] = await connection.query(
      `SELECT * FROM establishments LIMIT 1`
    );

    const response = await request(app)
      .post("/inventories/sync")
      .send({
        establishment_id: establishment.id,
        inventoryBooks: [
          {
            book_id: book.id,
            quantity: 5,
          },
        ],
        total_quantity: 5,
      })
      .set({ Authorization: `Bearer ${token}` });

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.errors).toEqual([]);
    expect(response.body.wasCreated).toBe(true);
    expect(response.body.message.normalize("NFC")).toBe(
      "Inventário sincronizado com sucesso".normalize("NFC")
    );
  });

  it("should be able to return book errors when sync inventory", async () => {
    const [establishment] = await connection.query(
      `SELECT * FROM establishments LIMIT 1`
    );

    const ids = [v4(), v4()];

    const response = await request(app)
      .post("/inventories/sync")
      .send({
        establishment_id: establishment.id,
        inventoryBooks: [
          {
            book_id: ids[0],
            quantity: 5,
          },
          {
            book_id: ids[1],
            quantity: 5,
          },
        ],
        total_quantity: 5,
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBe(2);
    expect(response.body.errors).toEqual([
      {
        id: ids[0],
        type: "book",
      },
      {
        id: ids[1],
        type: "book",
      },
    ]);
    expect(response.body.wasCreated).toBe(false);
    expect(response.body.message.normalize("NFC")).toBe(
      "Erro ao sincronizar o inventário".normalize("NFC")
    );
  });

  it("should be able to return establishment error when sync inventory", async () => {
    const [book] = await connection.query(`SELECT * FROM books LIMIT 1`);

    const id = v4();

    const response = await request(app)
      .post("/inventories/sync")
      .send({
        establishment_id: id,
        inventoryBooks: [
          {
            book_id: book.id,
            quantity: 5,
          },
        ],
        total_quantity: 5,
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      {
        id,
        type: "establishment",
      },
    ]);
    expect(response.body.wasCreated).toBe(false);
    expect(response.body.message.normalize("NFC")).toBe(
      "Erro ao sincronizar o inventário".normalize("NFC")
    );
  });
});
