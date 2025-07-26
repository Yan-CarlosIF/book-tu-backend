import { Category } from "../../infra/typeorm/entities/Category";
import { ICategoriesRepository } from "../Icategories.repository";

export class CategoriesRepositoryInMemory implements ICategoriesRepository {
  categories: Category[] = [];

  async create(name: string): Promise<void> {
    const category = new Category();

    category.name = name;

    this.categories.push(category);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.name === name);
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    return this.categories.filter((category) => ids.includes(category.id));
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }
}
