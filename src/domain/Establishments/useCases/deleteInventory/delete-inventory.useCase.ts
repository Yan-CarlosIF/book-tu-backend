import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class DeleteInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository
  ) {}

  async execute(id: string) {
    const inventory = await this.inventoriesRepository.findInventoryById(id);

    if (!inventory) {
      throw new AppError("Inventário não encontrado", 404);
    }

    await this.inventoriesRepository.delete(id);
  }
}
