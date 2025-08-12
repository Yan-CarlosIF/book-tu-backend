import { BooksRepositoryInMemory } from "@/domain/Books/repositories/in-memory/books.repository-in-memory";
import { AppError } from "@/infra/errors/app-error";

import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { InventoriesRepositoryInMemory } from "../../repositories/in-memory/inventories.repository-in-memory";
import { CreateInventoryUseCase } from "./create-inventory.useCase";

describe("[POST] /inventories", () => {
  let inventoriesRepository: InventoriesRepositoryInMemory;
  let booksRepository: BooksRepositoryInMemory;
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let createInventoryUseCase: CreateInventoryUseCase;

  beforeAll(() => {
    establishmentsRepository = new EstablishmentsRepositoryInMemory();
    booksRepository = new BooksRepositoryInMemory();
    inventoriesRepository = new InventoriesRepositoryInMemory();

    createInventoryUseCase = new CreateInventoryUseCase(
      inventoriesRepository,
      booksRepository,
      establishmentsRepository
    );
  });

  it("should be able to create a new inventory", async () => {
    await establishmentsRepository.create({
      name: "Establishment 1",
      cep: "00000-000",
      city: "City 1",
      cnpj: "00.000.000/0000-00",
      description: "Description 1",
      district: "District 1",
      state: "State 1",
    });

    await booksRepository.create({
      title: "Book 1",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await booksRepository.create({
      title: "Book 2",
      author: "Author 2",
      release_year: 2000,
      price: 10,
      description: "Description 2",
      categories: [],
    });

    const [establishment] = establishmentsRepository.establishments;
    const [book, book2] = booksRepository.books;

    await createInventoryUseCase.execute({
      establishment_id: establishment.id,
      inventoryBooks: [
        {
          book_id: book.id,
          quantity: 10,
        },
        {
          book_id: book2.id,
          quantity: 10,
        },
      ],
      total_quantity: 10,
    });

    expect(inventoriesRepository.inventories.length).toBe(1);
    expect(inventoriesRepository.inventories[0].books.length).toBe(2);
  });

  it("should not be able to create a new inventory if establishment is not found", async () => {
    await expect(
      createInventoryUseCase.execute({
        establishment_id: "establishment_id",
        inventoryBooks: [
          {
            book_id: "book_id",
            quantity: 10,
          },
        ],
        total_quantity: 10,
      })
    ).rejects.toEqual(new AppError("Estabelecimento não encontrado", 404));
  });

  it("should not be able to create a new inventory if book is not found", async () => {
    await establishmentsRepository.create({
      name: "Establishment 1",
      cep: "00000-000",
      city: "City 1",
      cnpj: "00.000.000/0000-00",
      description: "Description 1",
      district: "District 1",
      state: "State 1",
    });

    await expect(
      createInventoryUseCase.execute({
        establishment_id: establishmentsRepository.establishments[0].id,
        inventoryBooks: [
          {
            book_id: "book_id",
            quantity: 10,
          },
        ],
        total_quantity: 10,
      })
    ).rejects.toEqual(new AppError("Um ou mais livros não são válidos", 404));
  });
});
