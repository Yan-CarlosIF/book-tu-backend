import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

describe("[PATCH] /establishments/:id", () => {
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

  it("should be able to update an establishment", async () => {
    await request(app)
      .post("/establishments")
      .send({
        name: "Estabelecimento Teste",
        cnpj: "92.557.193/0001-02",
        state: "SP",
        city: "São Paulo",
        district: "Bairro Teste",
        cep: "12345-678",
        description: "Descrição do estabelecimento",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const [{ id }] = await connection.query(
      `SELECT id FROM establishments WHERE cnpj = '92.557.193/0001-02'`
    );

    await request(app)
      .patch(`/establishments/${id}`)
      .send({
        name: "Estabelecimento Teste Atualizado",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const [{ name: establishmentName }] = await connection.query(
      `SELECT name FROM establishments WHERE id = '${id}'`
    );

    expect(establishmentName).toEqual("Estabelecimento Teste Atualizado");
  });

  it("should not be able to update an establishment if it does not exist", async () => {
    const response = await request(app)
      .patch(`/establishments/${v4()}`)
      .send({
        name: "Estabelecimento Teste Atualizado",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.message).toEqual("Estabelecimento não encontrado");
    expect(response.status).toBe(404);
  });

  it("should not be able to update an establishment if not authenticated", async () => {
    const response = await request(app).patch(`/establishments/${v4()}`).send({
      name: "Estabelecimento Teste Atualizado",
    });

    expect(response.body.message).toEqual("Token not found");
    expect(response.status).toBe(401);
  });

  it("should not be able to update an establishment if user is not admin", async () => {
    const password = await hash("123", 8);

    await connection.query(
      `INSERT INTO users(id, name, registration, login, password, role, permission)
       VALUES
       ('${v4()}', 'Random user', '15dawdwa', 'operator-test', '${password}', 'user', 'operator');`
    );

    const [{ id }] = await connection.query(
      `SELECT id FROM establishments WHERE cnpj = '92.557.193/0001-02'`
    );

    const responseOperatorAuth = await request(app).post("/auth/session").send({
      login: "operator-test",
      password: "123",
    });

    const { token: tokenOperator } = responseOperatorAuth.body;

    await request(app)
      .patch(`/establishments/${id}`)
      .send({
        name: "Estabelecimento Teste Atualizado",
      })
      .set({
        Authorization: `Bearer ${tokenOperator}`,
      });
  });
});
