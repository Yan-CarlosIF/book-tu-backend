import { inject, injectable } from "tsyringe";

import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";
import { AppError } from "@/infra/errors/app-error";

import { ICreateInventoryDTO } from "../../dto/Icreate-inventory.dto";
import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class CreateInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository,
    @inject("BooksRepository")
    private booksRepository: IBooksRepository
  ) {}

  async execute(data: ICreateInventoryDTO) {
    const books = await this.booksRepository.findBooksByIds(
      data.inventoryBooks.map((book) => book.book_id)
    );

    if (books.length !== data.inventoryBooks.length) {
      throw new AppError("Um ou mais livros não são válidos", 404);
    }

    await this.inventoriesRepository.create({
      establishment_id: data.establishment_id,
      inventoryBooks: data.inventoryBooks,
      total_quantity: data.total_quantity,
    });
  }
}
