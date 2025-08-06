import { AppError } from "@/infra/errors/app-error";

import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { CreateEstablishmentUseCase } from "./create-establishment.useCase";

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
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let createEstablishmentUseCase: CreateEstablishmentUseCase;

  beforeEach(() => {
    establishmentsRepository = new EstablishmentsRepositoryInMemory();
    createEstablishmentUseCase = new CreateEstablishmentUseCase(
      establishmentsRepository
    );
  });

  it("should be able to create a new establishment", async () => {
    await createEstablishmentUseCase.execute(establishmentExample);

    expect(establishmentsRepository.establishments.length).toBe(1);
    expect(establishmentsRepository.establishments[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...establishmentExample,
      })
    );
  });

  it("should not be able to create a new establishment with the same cnpj", async () => {
    await createEstablishmentUseCase.execute(establishmentExample);

    await expect(
      createEstablishmentUseCase.execute(establishmentExample)
    ).rejects.toEqual(new AppError("Estabelecimento já cadastrado", 400));
  });
});
