import { Book } from "@/domain/Books/infra/typeorm/entities/Book";

import { IStockItemsPaginationDTO } from "../../dto/Istock-items-pagination.dto";
import { Establishment } from "../../infra/typeorm/entities/Establishment";
import { Stock } from "../../infra/typeorm/entities/Stock";
import { StockItem } from "../../infra/typeorm/entities/StockItem";
import { IStocksRepository } from "../Istocks.repository";

export class StocksRepositoryInMemory implements IStocksRepository {
  stocks: Stock[] = [];
  stockItems: StockItem[] = [];

  async seedStock(establishment: Establishment, books: Book[]) {
    const stock1 = new Stock();
    stock1.establishment_id = establishment.id;
    stock1.establishment = establishment;

    const newStockItems = books.map((book) => {
      const stockItem = new StockItem();
      stockItem.book_id = book.id;
      stockItem.book = book;
      stockItem.stock_id = stock1.id;
      stockItem.stock = stock1;
      stockItem.quantity = 10;
      return stockItem;
    });

    stock1.books = newStockItems;

    this.stocks.push(stock1);
    this.stockItems.push(...newStockItems);
  }

  async listStocksItems(
    page: number,
    id?: string,
    search?: string
  ): Promise<IStockItemsPaginationDTO> {
    let filteredItems = this.stockItems;

    if (id) {
      filteredItems = this.stockItems.filter(
        (stockItem) => stockItem.stock.establishment.id === id
      );
    }

    if (search) {
      filteredItems = this.stockItems.filter((stockItem) =>
        stockItem.book.title.includes(search)
      );
    }

    const totalUnits = filteredItems.reduce(
      (acc, stockItem) => acc + stockItem.quantity,
      0
    );

    const stockItemsPaginated = filteredItems.slice((page - 1) * 10, page * 10);

    return {
      data: stockItemsPaginated,
      total: filteredItems.length,
      page,
      totalUnits,
      lastPage: Math.ceil(filteredItems.length / 10),
    };
  }
  async findStockByEstablishmentId(id: string): Promise<Stock | undefined> {
    return this.stocks.find((stock) => stock.establishment_id === id);
  }
}
