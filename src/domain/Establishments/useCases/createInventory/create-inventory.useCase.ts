import { inject, injectable } from "tsyringe";

import { ICreateInventoryDTO } from "../../dto/Icreate-inventory.dto";
import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class CreateInventoryUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository
  ) {}

  async execute(data: ICreateInventoryDTO) {
    await this.inventoriesRepository.create(data);
  }
}
