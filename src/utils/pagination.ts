import { SelectQueryBuilder } from "typeorm";

import { Book } from "@/domain/Books/infra/typeorm/entities/Book";
import { Category } from "@/domain/Books/infra/typeorm/entities/Category";
import { Establishment } from "@/domain/Establishments/infra/typeorm/entities/Establishment";
import { Inventory } from "@/domain/Establishments/infra/typeorm/entities/Inventory";
import { InventoryBooks } from "@/domain/Establishments/infra/typeorm/entities/InventoryBooks";
import { StockItem } from "@/domain/Establishments/infra/typeorm/entities/StockItem";
import { User } from "@/domain/Users/infra/typeorm/entities/User";

export async function pagination<
  T extends
    | Book
    | Category
    | User
    | Establishment
    | StockItem
    | Inventory
    | InventoryBooks
>(queryBuilder: SelectQueryBuilder<T>, page: number, limit: number) {
  const safePage = Math.max(Number(page) || 1, 1);

  const total = await queryBuilder.getCount();

  const lastPage = Math.ceil(total / limit);

  const finalPage = Math.min(safePage, lastPage);

  const startIndex = (safePage - 1) * limit;

  queryBuilder.skip(startIndex).take(limit);

  const data = await queryBuilder.getMany();

  return {
    data,
    page: finalPage,
    total,
    lastPage,
  };
}
