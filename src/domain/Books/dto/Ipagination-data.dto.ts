import { Establishment } from "@/domain/Establishments/infra/typeorm/entities/Establishment";
import { Inventory } from "@/domain/Establishments/infra/typeorm/entities/Inventory";
import { StockItem } from "@/domain/Establishments/infra/typeorm/entities/StockItem";

import { Book } from "../infra/typeorm/entities/Book";
import { Category } from "../infra/typeorm/entities/Category";

export interface IPaginationData {
  data: Book[] | Category[] | Establishment[] | StockItem[] | Inventory[];
  page: number;
  total: number;
  lastPage: number;
}
