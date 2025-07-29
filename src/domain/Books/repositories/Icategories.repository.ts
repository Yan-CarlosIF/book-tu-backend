import { IPaginationData } from "../dto/Ipagination-data.dto";
import { Category } from "../infra/typeorm/entities/Category";

export interface ICategoriesRepository {
  create(name: string): Promise<void>;
  findByName(name: string): Promise<Category | undefined>;
  findByIds(ids: string[]): Promise<Category[]>;
  findById(id: string): Promise<Category | undefined>;
  list(): Promise<Category[]>;
  listWithPagination(page: number, sort?: string): Promise<IPaginationData>;
  update(category: Category, name: string): Promise<void>;
  delete(category: Category): Promise<void>;
}
