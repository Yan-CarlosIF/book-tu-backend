import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[GET] /establishments", () => {
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

    for (let i = 0; i < 20; i++) {
      await request(app)
        .post("/establishments")
        .send({
          name: `Estabelecimento Teste ${i}`,
          cnpj: `12.345.678/9012-${i.toString().padStart(2, "0")}`,
          state: "SP",
          city: "São Paulo",
          district: "Bairro Teste",
          cep: "12345-678",
          description: "Descrição do estabelecimento",
        })
        .set({
          Authorization: `Bearer ${token}`,
        });
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all establishments with pagination", async () => {
    const response = await request(app)
      .get("/establishments")
      .query({
        page: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.establishments.length).toBe(10);
    expect(response.body.total).toBe(20);
    expect(response.body.lastPage).toBe(2);
    expect(response.body.page).toBe(1);
    expect(response.status).toBe(200);
  });

  it("should be able to filter establishments by name or cnpj", async () => {
    const response = await request(app)
      .get("/establishments")
      .query({
        search: "Estabelecimento Teste 0",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.establishments.length).toBe(1);
    expect(response.body.total).toBe(1);
    expect(response.body.lastPage).toBe(1);
    expect(response.body.page).toBe(1);
    expect(response.status).toBe(200);
    expect(response.body.establishments[0].name).toBe(
      "Estabelecimento Teste 0"
    );

    const response2 = await request(app)
      .get("/establishments")
      .query({
        search: "12.345.678/9012-01",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response2.body.establishments.length).toBe(1);
    expect(response2.body.total).toBe(1);
    expect(response2.body.lastPage).toBe(1);
    expect(response2.body.page).toBe(1);
    expect(response2.status).toBe(200);
    expect(response2.body.establishments[0].cnpj).toBe("12.345.678/9012-01");
  });

  it("should not be able to list all establishments if user is not authenticated", async () => {
    const response = await request(app).get("/establishments");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
  });
});
