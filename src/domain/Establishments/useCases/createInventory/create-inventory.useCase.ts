import { inject, injectable } from "tsyringe";

import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";
import { AppError } from "@/infra/errors/app-error";

import { ICreateInventoryDTO } from "../../dto/Icreate-inventory.dto";
import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";
import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class CreateInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository,
    @inject("BooksRepository")
    private booksRepository: IBooksRepository,
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute(data: ICreateInventoryDTO) {
    const establishment = await this.establishmentsRepository.findById(
      data.establishment_id
    );

    if (!establishment) {
      throw new AppError("Estabelecimento não encontrado", 404);
    }

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
