import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { Book } from "@/domain/Books/infra/typeorm/entities/Book";

import { Establishment } from "../../infra/typeorm/entities/Establishment";
import { Stock } from "../../infra/typeorm/entities/Stock";
import { StockItem } from "../../infra/typeorm/entities/StockItem";
import { IStocksRepository } from "../Istocks.repository";

export class StocksRepositoryInMemory implements IStocksRepository {
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

    this.stockItems.push(...newStockItems);
  }

  async listStocksItems(page: number, id?: string): Promise<IPaginationData> {
    let filteredItems = this.stockItems;

    if (id) {
      filteredItems = this.stockItems.filter(
        (stockItem) => stockItem.stock.establishment.id === id
      );
    }

    const stockItemsPaginated = filteredItems.slice((page - 1) * 10, page * 10);

    return {
      data: stockItemsPaginated,
      total: filteredItems.length,
      page,
      lastPage: Math.ceil(filteredItems.length / 10),
    };
  }
}
