import { BooksRepositoryInMemory } from "@/domain/Books/repositories/in-memory/books.repository-in-memory";
import { AppError } from "@/infra/errors/app-error";

import { InventoriesRepositoryInMemory } from "../../repositories/in-memory/inventories.repository-in-memory";
import { UpdateInventoryUseCase } from "./update-inventory.useCase";

describe("[PUT] /inventories/:id", () => {
  let inventoriesRepository: InventoriesRepositoryInMemory;
  let booksRepository: BooksRepositoryInMemory;
  let updateInventoryUseCase: UpdateInventoryUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    inventoriesRepository = new InventoriesRepositoryInMemory();
    updateInventoryUseCase = new UpdateInventoryUseCase(
      booksRepository,
      inventoriesRepository
    );
  });

  it("should be able to update a inventory", async () => {
    await booksRepository.create({
      title: "Book 1",
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

    await updateInventoryUseCase.execute({
      id: inventory.id,
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
        inventoryBooks: [],
      })
    ).rejects.toEqual(new AppError("Inventário não encontrado", 404));
  });

  it("should not be able to update a inventory if some book does not exist", async () => {
    await inventoriesRepository.create({
      establishment_id: "establishment_id",
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
        inventoryBooks: [
          {
            book_id: "id",
            quantity: 2,
          },
        ],
      })
    ).rejects.toEqual(new AppError("Um ou mais livros não são válidos", 404));
  });
});
