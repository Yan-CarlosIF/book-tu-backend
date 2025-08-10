import { getRepository, Repository } from "typeorm";

import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { IStocksRepository } from "@/domain/Establishments/repositories/Istocks.repository";
import { pagination } from "@/utils/pagination";

import { Stock } from "../entities/Stock";
import { StockItem } from "../entities/StockItem";

export class StocksRepository implements IStocksRepository {
  private stocks: Repository<Stock>;
  private stockItems: Repository<StockItem>;

  constructor() {
    this.stocks = getRepository(Stock);
    this.stockItems = getRepository(StockItem);
  }

  async listStocksItems(page: number, id?: string): Promise<IPaginationData> {
    const queryBuilder = this.stockItems.createQueryBuilder("stock_items");

    queryBuilder
      .leftJoinAndSelect("stock_items.stock", "stock")
      .leftJoinAndSelect("stock.establishment", "establishment")
      .leftJoinAndSelect("stock_items.book", "book");

    if (id) {
      queryBuilder.where("establishment.id = :id", { id: id });
    }

    return await pagination<StockItem>(queryBuilder, page, 10);
  }
}
