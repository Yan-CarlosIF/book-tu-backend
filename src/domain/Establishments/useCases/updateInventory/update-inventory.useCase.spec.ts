import { BooksRepositoryInMemory } from "@/domain/Books/repositories/in-memory/books.repository-in-memory";
import { AppError } from "@/infra/errors/app-error";

import { Status } from "../../infra/typeorm/entities/Inventory";
import { EstablishmentsRepositoryInMemory } from "../../repositories/in-memory/establishments.repository-in-memory";
import { InventoriesRepositoryInMemory } from "../../repositories/in-memory/inventories.repository-in-memory";
import { UpdateInventoryUseCase } from "./update-inventory.useCase";

describe("[PUT] /inventories/:id", () => {
  let inventoriesRepository: InventoriesRepositoryInMemory;
  let booksRepository: BooksRepositoryInMemory;
  let establishmentsRepository: EstablishmentsRepositoryInMemory;
  let updateInventoryUseCase: UpdateInventoryUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    inventoriesRepository = new InventoriesRepositoryInMemory();
    establishmentsRepository = new EstablishmentsRepositoryInMemory();

    updateInventoryUseCase = new UpdateInventoryUseCase(
      booksRepository,
      inventoriesRepository,
      establishmentsRepository
    );
  });

  it("should be able to update a inventory", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    const [book] = booksRepository.books;

    await inventoriesRepository.create({
      establishment_id: "establishment_id",
      inventoryBooks: [
        {
          book_id: book.id,
          quantity: 1,
        },
      ],
      total_quantity: 1,
    });

    const [inventory] = inventoriesRepository.inventories;

    await establishmentsRepository.create({
      name: "Establishment 1",
      cep: "cep",
      city: "city",
      cnpj: "cnpj",
      district: "district",
      state: "state",
      description: "description",
    });

    const [establishment] = establishmentsRepository.establishments;

    await updateInventoryUseCase.execute({
      id: inventory.id,
      establishment_id: establishment.id,
      inventoryBooks: [
        {
          book_id: book.id,
          quantity: 2,
        },
      ],
    });

    expect(inventoriesRepository.inventories[0].books[0].quantity).toBe(2);
    expect(inventoriesRepository.inventories[0].total_quantity).toBe(2);
  });

  it("should not be able to update a inventory if inventory does not exist", async () => {
    await expect(
      updateInventoryUseCase.execute({
        id: "id",
        establishment_id: "establishment_id",
        inventoryBooks: [],
      })
    ).rejects.toEqual(new AppError("Inventário não encontrado", 404));
  });

  it("should not be able to update a inventory if some book does not exist", async () => {
    await inventoriesRepository.create({
      establishment_id: "establishment.id",
      inventoryBooks: [
        {
          book_id: "id",
          quantity: 1,
        },
      ],
      total_quantity: 1,
    });

    const [inventory] = inventoriesRepository.inventories;

    await expect(
      updateInventoryUseCase.execute({
        id: inventory.id,
        establishment_id: "establishment.id",
        inventoryBooks: [
          {
            book_id: "id",
            quantity: 2,
          },
        ],
      })
    ).rejects.toEqual(new AppError("Um ou mais livros não são válidos", 404));
  });

  it("should not be able to update a inventory if establishment does not exist", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    const [book] = booksRepository.books;

    await inventoriesRepository.create({
      establishment_id: "establishment.id",
      inventoryBooks: [],
      total_quantity: 0,
    });

    const [inventory] = inventoriesRepository.inventories;

    await expect(
      updateInventoryUseCase.execute({
        id: inventory.id,
        establishment_id: "id",
        inventoryBooks: [
          {
            book_id: book.id,
            quantity: 1,
          },
        ],
      })
    ).rejects.toEqual(new AppError("Estabelecimento não encontrado", 404));
  });

  it("should not be able to update a processed inventory", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    const [book] = booksRepository.books;

    await inventoriesRepository.create({
      establishment_id: "establishment_id",
      inventoryBooks: [
        {
          book_id: book.id,
          quantity: 1,
        },
      ],
      total_quantity: 1,
    });

    const [inventory] = inventoriesRepository.inventories;

    inventory.status = Status.PROCESSED;

    await expect(
      updateInventoryUseCase.execute({
        id: inventory.id,
        establishment_id: "establishment_id",
        inventoryBooks: [
          {
            book_id: book.id,
            quantity: 2,
          },
        ],
      })
    ).rejects.toEqual(
      new AppError("Não é possivel atualizar um inventário processado", 400)
    );
  });
});
