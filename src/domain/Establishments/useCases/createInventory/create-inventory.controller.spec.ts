import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import { seed } from "@/infra/typeorm/seed";

describe("[POST] /inventories", () => {
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

  it("should be able to create a new inventory", async () => {
    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments LIMIT 1`
    );

    const booksIds = await connection.query(`SELECT id FROM books LIMIT 5`);

    const response = await request(app)
      .post("/inventories")
      .send({
        establishment_id: establishmentId,
        total_quantity: 5 * booksIds.length,
        inventoryBooks: [
          {
            book_id: booksIds[0].id,
            quantity: 5,
          },
          {
            book_id: booksIds[1].id,
            quantity: 5,
          },
          {
            book_id: booksIds[2].id,
            quantity: 5,
          },
          {
            book_id: booksIds[3].id,
            quantity: 5,
          },
          {
            book_id: booksIds[4].id,
            quantity: 5,
          },
        ],
      })
      .set({ Authorization: `Bearer ${token}` });

    const {
      body: {
        data: [inventory],
      },
    } = await request(app)
      .get("/inventories")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(inventory.total_quantity).toBe(5 * booksIds.length);
    expect(inventory.establishment_id).toBe(establishmentId);
    expect(inventory.status).toBe("unprocessed");
  });

  it("should not be able to create a new inventory if user is not authenticated", async () => {
    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments LIMIT 1`
    );

    const booksIds = await connection.query(`SELECT id FROM books LIMIT 5`);

    const response = await request(app)
      .post("/inventories")
      .send({
        establishment_id: establishmentId,
        total_quantity: 5 * booksIds.length,
        inventoryBooks: booksIds.map((book: { id: string }) => ({
          book_id: book.id,
          quantity: 5,
        })),
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });

  it("should not be able to create a new inventory if establishment does not exist", async () => {
    const response = await request(app)
      .post("/inventories")
      .send({
        establishment_id: v4(),
        total_quantity: 0,
        inventoryBooks: [],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Estabelecimento não encontrado");
  });

  it("should not be able to create a new inventory if books does not exist", async () => {
    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments LIMIT 1`
    );

    const response = await request(app)
      .post("/inventories")
      .send({
        establishment_id: establishmentId,
        total_quantity: 0,
        inventoryBooks: [{ book_id: v4(), quantity: 0 }],
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message.normalize("NFC")).toEqual(
      "Um ou mais livros não são válidos".normalize("NFC")
    );
  });
});
