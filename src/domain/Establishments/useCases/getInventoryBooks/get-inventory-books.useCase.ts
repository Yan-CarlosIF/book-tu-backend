import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { InventoryBooks } from "../../infra/typeorm/entities/InventoryBooks";
import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class GetInventoryBooksUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository
  ) {}

  async execute(page: number = 1, id: string) {
    const inventory = await this.inventoriesRepository.findInventoryById(
      id,
      true
    );

    if (!inventory) {
      throw new AppError("Inventário não encontrado", 404);
    }

    if (!page || page < 1) {
      page = 1;
    }

    const paginatedBooks = await this.inventoriesRepository.getInventoryBooks(
      page,
      id
    );

    return {
      books: paginatedBooks.data as InventoryBooks[],
      page: paginatedBooks.page,
      lastPage: paginatedBooks.lastPage,
      total: paginatedBooks.total,
    };
  }
}
