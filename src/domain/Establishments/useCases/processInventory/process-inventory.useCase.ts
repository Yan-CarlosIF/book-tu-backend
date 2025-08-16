import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IInventoriesRepository } from "../../repositories/Iinventories.repository";
import { IStocksRepository } from "../../repositories/Istocks.repository";

@injectable()
export class ProcessInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository,
    @inject("StocksRepository")
    private stocksRepository: IStocksRepository
  ) {}

  async execute(id: string) {
    const inventory = await this.inventoriesRepository.findInventoryById(id);

    if (!inventory) {
      throw new AppError("Inventário não encontrado", 404);
    }

    if (inventory.status === "processed") {
      throw new AppError("Inventário já processado", 400);
    }

    const stock = await this.stocksRepository.findStockByEstablishmentId(
      inventory.establishment_id
    );

    if (!stock) {
      throw new AppError("Estoque do estabelecimento não encontrado", 404);
    }

    await this.inventoriesRepository.process(inventory, stock);
  }
}
