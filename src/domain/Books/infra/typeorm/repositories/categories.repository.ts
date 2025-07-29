import { getRepository, Repository } from "typeorm";

import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { ICategoriesRepository } from "@/domain/Books/repositories/Icategories.repository";
import { pagination } from "@/utils/pagination";

import { Category } from "../entities/Category";

export class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create(name: string): Promise<void> {
    const category = this.repository.create({ name });

    await this.repository.save(category);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return await this.repository.findOne({ name });
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    return await this.repository.findByIds(ids);
  }

  async findById(id: string): Promise<Category | undefined> {
    return await this.repository.findOne({ id });
  }

  async list(): Promise<Category[]> {
    return await this.repository.find();
  }

  async listWithPagination(
    page: number,
    sort?: string
  ): Promise<IPaginationData> {
    const queryBuilder = this.repository.createQueryBuilder("categories");

    switch (sort) {
      case "asc":
        queryBuilder.orderBy("categories.name", "ASC");
        break;
      case "desc":
        queryBuilder.orderBy("categories.name", "DESC");
        break;
    }

    return await pagination<Category>(queryBuilder, page, 10);
  }

  async update(category: Category, name: string): Promise<void> {
    const categoryIndex = this.repository.merge(category, { name });

    await this.repository.save(categoryIndex);
  }

  async delete(category: Category): Promise<void> {
    await this.repository.delete(category.id);
  }
}
