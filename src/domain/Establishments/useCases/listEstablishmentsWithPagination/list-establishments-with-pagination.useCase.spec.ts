import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { ListEstablishmentsWithPaginationUseCase } from "./list-establishments-with-pagination.useCase";

describe("[GET] /establishments", () => {
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let listEstablishmentsWithPaginationUseCase: ListEstablishmentsWithPaginationUseCase;

  beforeEach(() => {
    establishmentsRepository = new EstablishmentsRepositoryInMemory();
    listEstablishmentsWithPaginationUseCase =
      new ListEstablishmentsWithPaginationUseCase(establishmentsRepository);
  });

  it("should be able to list all establishments with pagination", async () => {
    for (let i = 0; i < 20; i++) {
      establishmentsRepository.create({
        name: "Estabelecimento Teste",
        cnpj: `12.345.678/9012-${i.toString().padStart(2, "0")}`,
        state: "SP",
        city: "São Paulo",
        district: "Bairro Teste",
        cep: "12345-678",
        description: "Descrição do estabelecimento",
      });
    }

    const { establishments, total, lastPage, page } =
      await listEstablishmentsWithPaginationUseCase.execute();

    expect(page).toBe(1);
    expect(total).toBe(20);
    expect(lastPage).toBe(2);
    expect(establishments.length).toBe(10);
    expect(establishments[0]).toHaveProperty("id");
    expect(establishments[9]).toHaveProperty("id");
  });
});
