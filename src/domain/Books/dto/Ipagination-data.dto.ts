import { Establishment } from "@/domain/Establishments/infra/typeorm/entities/Establishment";

import { Book } from "../infra/typeorm/entities/Book";
import { Category } from "../infra/typeorm/entities/Category";

export interface IPaginationData {
  data: Book[] | Category[] | Establishment[];
  page: number;
  total: number;
  lastPage: number;
}
