import { Brackets, getRepository, Repository } from "typeorm";

import { IStockItemsPaginationDTO } from "@/domain/Establishments/dto/Istock-items-pagination.dto";
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

  async listStocksItems(
    page: number,
    id?: string,
    search?: string
  ): Promise<IStockItemsPaginationDTO> {
    const queryBuilder = this.stockItems.createQueryBuilder("stock_items");

    queryBuilder
      .leftJoinAndSelect("stock_items.stock", "stock")
      .leftJoinAndSelect("stock.establishment", "establishment")
      .leftJoinAndSelect("stock_items.book", "book");

    if (id) {
      queryBuilder.where("establishment.id = :id", { id: id });
    }

    if (search) {
      const likeSearch = `%${search}%`;

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("book.title ILIKE :search", { search: likeSearch }).orWhere(
            "book.identifier ILIKE :search",
            { search: likeSearch }
          );
        })
      );
    }

    const safePage = Math.max(Number(page) || 1, 1);

    const total = await queryBuilder.getCount();

    const totalUnitsResult = await queryBuilder
      .clone()
      .select("SUM(stock_items.quantity)", "sum")
      .getRawOne<{ sum: string }>();

    const totalUnits = Number(totalUnitsResult?.sum || 0);

    const lastPage = Math.ceil(total / 10);

    const finalPage = Math.min(safePage, lastPage);

    const startIndex = (safePage - 1) * 10;

    queryBuilder.skip(startIndex).take(10);

    const data = await queryBuilder.getMany();

    return {
      data,
      page: finalPage,
      total,
      totalUnits,
      lastPage,
    };
  }

  async findStockByEstablishmentId(id: string): Promise<Stock | undefined> {
    return await this.stocks.findOne({
      where: { establishment_id: id },
      relations: ["books"],
    });
  }
}
