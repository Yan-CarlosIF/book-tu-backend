import { inject, injectable } from "tsyringe";

import { IStocksRepository } from "../../repositories/Istocks.repository";

@injectable()
export class ListStockItemsUseCase {
  constructor(
    @inject("StocksRepository")
    private stocksRepository: IStocksRepository
  ) {}

  async execute(page?: number, establishmentId?: string, search?: string) {
    if (!page || page < 1) {
      page = 1;
    }

    return await this.stocksRepository.listStocksItems(
      page,
      establishmentId,
      search
    );
  }
}
