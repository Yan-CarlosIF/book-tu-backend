import { BooksRepositoryInMemory } from "@/domain/Books/repositories/in-memory/books.repository-in-memory";

import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { StocksRepositoryInMemory } from "../../repositories/in-memory/stocks.repository-in-memory";
import { ListStockItemsUseCase } from "./list-stock-items.useCase";

describe("[GET] /stocks", () => {
  let booksRepository: BooksRepositoryInMemory;
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let stocksRepository: StocksRepositoryInMemory;
  let listStockItemsUseCase: ListStockItemsUseCase;

  beforeAll(() => {
    booksRepository = new BooksRepositoryInMemory();
    establishmentsRepository = new EstablishmentsRepositoryInMemory();

    for (let i = 0; i < 30; i++) {
      booksRepository.create({
        title: `Book ${i + 1}`,
        author: `Author ${i + 1}`,
        release_year: 2000,
        price: 10,
        description: `Description ${i + 1}`,
        categories: [],
      });
    }

    establishmentsRepository.create({
      name: "Estabelecimento Teste",
      cnpj: "12.345.678/9012-34",
      state: "SP",
      city: "São Paulo",
      district: "Bairro Teste",
      cep: "12345-678",
      description: "Descrição do estabelecimento",
    });

    stocksRepository = new StocksRepositoryInMemory();
    listStockItemsUseCase = new ListStockItemsUseCase(stocksRepository);
  });

  it("should be able o list stock items with pagination", async () => {
    stocksRepository.seedStock(
      establishmentsRepository.establishments[0],
      booksRepository.books
    );

    const result = await listStockItemsUseCase.execute(1);

    expect(result.total).toBe(30);
    expect(result.lastPage).toBe(3);
    expect(result.page).toBe(1);
    expect(result.data.length).toBe(10);
  });

  it("should be able to filter stock items per establishment", async () => {
    establishmentsRepository.create({
      name: "Estabelecimento Teste 2",
      cnpj: "12.345.678/9012-35",
      state: "SP",
      city: "São Paulo",
      district: "Bairro Teste",
      cep: "12345-678",
      description: "Descrição do estabelecimento",
    });

    stocksRepository.seedStock(
      establishmentsRepository.establishments[1],
      booksRepository.books.slice(20, 30)
    );

    const establishment1 = establishmentsRepository.establishments[0];
    const establishment2 = establishmentsRepository.establishments[1];

    const result = await listStockItemsUseCase.execute(1, establishment1.id);
    const result2 = await listStockItemsUseCase.execute(1, establishment2.id);

    expect(result.total).toBe(30);
    expect(result.lastPage).toBe(3);
    expect(result.page).toBe(1);
    expect(result.data.length).toBe(10);

    expect(result2.total).toBe(10);
    expect(result2.lastPage).toBe(1);
    expect(result2.page).toBe(1);
    expect(result2.data.length).toBe(10);
  });
});
