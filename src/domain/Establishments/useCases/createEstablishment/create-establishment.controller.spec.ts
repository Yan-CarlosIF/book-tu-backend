import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 } from "uuid";

import { app } from "@/infra/http/app";
import createConnection from "@/infra/typeorm";

const establishmentExample = {
  name: "Estabelecimento Teste",
  cnpj: "12.345.678/9012-34",
  state: "SP",
  city: "São Paulo",
  district: "Bairro Teste",
  cep: "12345-678",
  description: "Descrição do estabelecimento",
};

describe("[POST] /establishments", () => {
  let connection: Connection;
  let token: string;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("admin", 8);
    const id = v4();

    await connection.query(
      `INSERT INTO users(id, name, registration, login, password, role, permission)
       VALUES
       ('${id}', 'Random user', '153252fs', 'user-test', '${password}', 'user', 'admin');`
    );

    const responseAuth = await request(app).post("/auth/session").send({
      login: "user-test",
      password: "admin",
    });

    token = responseAuth.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new establishment", async () => {
    const response = await request(app)
      .post("/establishments")
      .send(establishmentExample)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new establishment with the same cnpj", async () => {
    const response = await request(app)
      .post("/establishments")
      .send(establishmentExample)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.message).toEqual("Estabelecimento já cadastrado");
    expect(response.status).toBe(400);
  });

  it("should not be able to create a new establishment without authentication", async () => {
    const response = await request(app)
      .post("/establishments")
      .send(establishmentExample);

    expect(response.body.message).toEqual("Token not found");
    expect(response.status).toBe(401);
  });

  it("should not be able to create a new establishment if cnpj is invalid", async () => {
    const response = await request(app)
      .post("/establishments")
      .send({
        ...establishmentExample,
        cnpj: "12345678901234",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.message).toEqual(
      "CNPJ deve estar no formato 00.000.000/0000-00"
    );
    expect(response.status).toBe(400);
  });

  it("should not be able to create a new establishment if cep is invalid", async () => {
    const response = await request(app)
      .post("/establishments")
      .send({
        ...establishmentExample,
        cep: "1234567",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.message).toEqual(
      "CEP deve estar no formato 00000-000"
    );
    expect(response.status).toBe(400);
  });
});
