import { inject, injectable } from "tsyringe";

import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";

import { ICreateInventoryDTO } from "../../dto/Icreate-inventory.dto";
import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";
import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

type SyncError = {
  id: string;
  type: "establishment" | "book";
};

@injectable()
export class SyncInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository,
    @inject("BooksRepository")
    private booksRepository: IBooksRepository,
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute({
    establishment_id,
    inventoryBooks,
    total_quantity,
  }: ICreateInventoryDTO) {
    const errors: SyncError[] = [];

    const establishment = await this.establishmentsRepository.findById(
      establishment_id
    );

    if (!establishment) {
      errors.push({
        id: establishment_id,
        type: "establishment",
      });
    }

    const books = await this.booksRepository.findBooksByIds(
      inventoryBooks.map((inventoryBook) => inventoryBook.book_id)
    );

    const invalidBooks = inventoryBooks.filter(
      (inventoryBook) =>
        !books.find((book) => book.id === inventoryBook.book_id)
    );

    invalidBooks.forEach((invalidBook) => {
      errors.push({
        id: invalidBook.book_id,
        type: "book",
      });
    });

    if (errors.length === 0) {
      this.inventoriesRepository.create({
        establishment_id,
        inventoryBooks,
        total_quantity,
      });
    }

    return {
      errors,
      wasCreated: errors.length === 0,
    };
  }
}
