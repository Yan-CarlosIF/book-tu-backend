import { inject, injectable } from "tsyringe";

import { IInventoriesRepository } from "../../repositories/Iinventories.repository";

@injectable()
export class ListInventoriesUseCase {
  constructor(
    @inject("InventoriesRepository")
    private inventoriesRepository: IInventoriesRepository
  ) {}

  async execute(page?: number, establishmentId?: string) {
    if (!page || page < 1) {
      page = 1;
    }

    return await this.inventoriesRepository.list(page, establishmentId);
  }
}
