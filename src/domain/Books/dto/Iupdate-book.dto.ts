import { Category } from "../infra/typeorm/entities/Category";

export interface IUpdateBookDTO {
  title?: string;
  identifier?: string;
  author?: string;
  release_year?: number;
  price?: number;
  description?: string;
  categories?: Category[];
}
