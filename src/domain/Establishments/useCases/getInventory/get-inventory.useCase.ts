import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class GetInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository
  ) {}

  async execute(id: string) {
    const inventory = await this.inventoriesRepository.findInventoryById(id, true);

    if (!inventory) {
      throw new AppError("Inventário não encontrado", 404);
    }

    return inventory;
  }
}
