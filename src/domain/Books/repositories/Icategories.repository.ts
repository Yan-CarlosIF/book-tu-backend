import { Category } from "../infra/typeorm/entities/Category";

export interface ICategoriesRepository {
  create(name: string): Promise<void>;
  findByName(name: string): Promise<Category | undefined>;
  findByIds(ids: string[]): Promise<Category[]>;
}
