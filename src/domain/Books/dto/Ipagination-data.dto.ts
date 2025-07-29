import { Book } from "../infra/typeorm/entities/Book";
import { Category } from "../infra/typeorm/entities/Category";

export interface IPaginationData {
  data: Book[] | Category[];
  page: number;
  total: number;
  lastPage: number;
}
