import { AppError } from "@/infra/errors/app-error";

import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { DeleteEstablishmentUseCase } from "./delete-establishment.useCase";

describe("[DELETE] /establishments/:id", () => {
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let deleteEstablishmentUseCase: DeleteEstablishmentUseCase;

  beforeEach(() => {
    establishmentsRepository = new EstablishmentsRepositoryInMemory();
    deleteEstablishmentUseCase = new DeleteEstablishmentUseCase(
      establishmentsRepository
    );
  });

  it("should be able to delete a establishment", async () => {
    await establishmentsRepository.create({
      name: "Establishment 1",
      cnpj: "123456789",
      state: "State 1",
      city: "City 1",
      district: "District 1",
      cep: "12345-678",
      description: "Description 1",
    });

    const id = establishmentsRepository.establishments[0].id;

    await deleteEstablishmentUseCase.execute(id);

    expect(establishmentsRepository.establishments.length).toBe(0);
  });

  it("should not be able to delete a non-existent establishment", async () => {
    await expect(
      deleteEstablishmentUseCase.execute("non-existent-id")
    ).rejects.toEqual(new AppError("Estabelecimento não encontrado", 404));
  });
});
