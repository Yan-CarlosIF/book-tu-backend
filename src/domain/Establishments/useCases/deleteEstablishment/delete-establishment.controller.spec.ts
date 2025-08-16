import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[DELETE] /establishments/:id", () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to delete an establishment", async () => {
    await request(app)
      .post("/establishments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Estabelecimento Teste",
        cnpj: "12.345.678/9012-34",
        state: "SP",
        city: "São Paulo",
        district: "Bairro Teste",
        cep: "12345-678",
        description: "Descrição do estabelecimento",
      });

    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments WHERE cnpj = '12.345.678/9012-34'`
    );

    await request(app)
      .delete(`/establishments/${establishmentId}`)
      .set({ Authorization: `Bearer ${token}` });

    const establishments = await connection.query(
      `SELECT * FROM establishments WHERE cnpj = '12.345.678/9012-34'`
    );

    expect(establishments.length).toBe(0);
  });

  it("should not be able to delete an establishment if user is not authenticated", async () => {
    await request(app)
      .post("/establishments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Estabelecimento Teste",
        cnpj: "12.345.678/9012-34",
        state: "SP",
        city: "São Paulo",
        district: "Bairro Teste",
        cep: "12345-678",
        description: "Descrição do estabelecimento",
      });

    const [{ id: establishmentId }] = await connection.query(
      `SELECT id FROM establishments WHERE cnpj = '12.345.678/9012-34'`
    );

    const response = await request(app).delete(
      `/establishments/${establishmentId}`
    );

    const establishments = await connection.query(
      `SELECT * FROM establishments WHERE cnpj = '12.345.678/9012-34'`
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Usuário não autenticado");
    expect(establishments.length).toBe(1);
  });

  it("should not be able to delete an establishment if it does not exist", async () => {
    const response = await request(app)
      .delete(`/establishments/${v4()}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Estabelecimento não encontrado");
  });
});
