import { inject, injectable } from "tsyringe";

import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";
import { AppError } from "@/infra/errors/app-error";

import { IUpdateInventoryDTO } from "../../dto/Iupdate-inventory.dto";
import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";
import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class UpdateInventoryUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository,
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository,
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute({ id, inventoryBooks, establishment_id }: IUpdateInventoryDTO) {
    const inventory = await this.inventoriesRepository.findInventoryById(id);

    if (!inventory) {
      throw new AppError("Inventário não encontrado", 404);
    }

    if (inventory.status === "processed") {
      throw new AppError(
        "Não é possivel atualizar um inventário processado",
        400
      );
    }

    const books = await this.booksRepository.findBooksByIds(
      inventoryBooks.map((book) => book.book_id)
    );

    if (books.length !== inventoryBooks.length) {
      throw new AppError("Um ou mais livros não são válidos", 404);
    }

    const establishment = await this.establishmentsRepository.findById(
      establishment_id
    );

    if (!establishment) {
      throw new AppError("Estabelecimento não encontrado", 404);
    }

    await this.inventoriesRepository.update(
      id,
      establishment_id,
      inventoryBooks
    );
  }
}
