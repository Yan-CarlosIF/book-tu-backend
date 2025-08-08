import { AppError } from "@/infra/errors/app-error";

import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { UpdateEstablishmentUseCase } from "./update-establishment.useCase";

describe("[PATCH] /establishments/:id", () => {
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let updateEstablishmentUseCase: UpdateEstablishmentUseCase;

  beforeEach(() => {
    establishmentsRepository = new EstablishmentsRepositoryInMemory();
    updateEstablishmentUseCase = new UpdateEstablishmentUseCase(
      establishmentsRepository
    );
  });

  it("should be able to update an establishment", async () => {
    await establishmentsRepository.create({
      name: "Estabelecimento Teste",
      cnpj: "12.345.678/9012-01",
      state: "SP",
      city: "São Paulo",
      district: "Bairro Teste",
      cep: "12345-678",
      description: "Descrição do estabelecimento",
    });

    const id = establishmentsRepository.establishments[0].id;

    await updateEstablishmentUseCase.execute(id, {
      name: "Estabelecimento 1",
      cnpj: "12.345.678/9212-01",
      state: "SP",
      city: "Ceará",
      district: "Bairro 1",
      cep: "12345-678",
      description: "Descrição",
    });

    const establishments = await establishmentsRepository.list();

    expect(establishments).toEqual([
      expect.objectContaining({
        name: "Estabelecimento 1",
        cnpj: "12.345.678/9212-01",
        state: "SP",
        city: "Ceará",
        district: "Bairro 1",
        cep: "12345-678",
        description: "Descrição",
      }),
    ]);
  });

  it("should not be able to update an establishment if it does not exist", async () => {
    await expect(
      updateEstablishmentUseCase.execute("invalid-id", {
        name: "Estabelecimento 1",
        cnpj: "12.345.678/9212-01",
        state: "SP",
        city: "Ceará",
        district: "Bairro 1",
        cep: "12345-678",
        description: "Descrição",
      })
    ).rejects.toEqual(new AppError("Estabelecimento não encontrado", 404));
  });
});
