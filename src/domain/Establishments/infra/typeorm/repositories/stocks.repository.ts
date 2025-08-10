import { getRepository, Repository } from "typeorm";

import { IStocksRepository } from "@/domain/Establishments/repositories/Istocks.repository";

import { Stock } from "../entities/Stock";
import { StockItem } from "../entities/StockItem";

export class StocksRepository implements IStocksRepository {
  private stocks: Repository<Stock>;
  private stockItems: Repository<StockItem>;

  constructor() {
    this.stocks = getRepository(Stock);
    this.stockItems = getRepository(StockItem);
  }

  async listAllStocksItems(): Promise<void> {
    await this.stockItems.find({ relations: ["stock", "book"] });
  }
}
