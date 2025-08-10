import { Establishment } from "@/domain/Establishments/infra/typeorm/entities/Establishment";
import { StockItem } from "@/domain/Establishments/infra/typeorm/entities/StockItem";

import { Book } from "../infra/typeorm/entities/Book";
import { Category } from "../infra/typeorm/entities/Category";

export interface IPaginationData {
  data: Book[] | Category[] | Establishment[] | StockItem[];
  page: number;
  total: number;
  lastPage: number;
}
