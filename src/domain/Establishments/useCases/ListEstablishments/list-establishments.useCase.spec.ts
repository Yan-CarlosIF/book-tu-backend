import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { ListEstablishmentsUseCase } from "./list-establishments.useCase";

describe("[GET] /establishments/all", () => {
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let listEstablishmentsUseCase: ListEstablishmentsUseCase;

  beforeEach(() => {
    establishmentsRepository = new EstablishmentsRepositoryInMemory();
    listEstablishmentsUseCase = new ListEstablishmentsUseCase(
      establishmentsRepository
    );
  });

  it("should be able to list all establishments", async () => {
    for (let i = 0; i < 15; i++) {
      await establishmentsRepository.create({
        name: "Estabelecimento Teste",
        cnpj: "12.345.678/9012-01",
        state: "SP",
        city: "São Paulo",
        district: "Bairro Teste",
        cep: "12345-678",
        description: "Descrição do estabelecimento",
      });
    }

    const establishments = await listEstablishmentsUseCase.execute();

    expect(establishments.length).toBe(15);
  });
});
