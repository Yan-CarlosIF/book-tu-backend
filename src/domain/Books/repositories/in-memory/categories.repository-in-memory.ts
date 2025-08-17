import { IPaginationData } from "../../dto/Ipagination-data.dto";
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

  async findById(id: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.id === id);
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }

  async update(category: Category, name: string): Promise<void> {
    const categoryIndex = this.categories.findIndex(
      (c) => c.id === category.id
    );

    this.categories[categoryIndex].name = name;
  }

  async delete(category: Category): Promise<void> {
    const categoryIndex = this.categories.findIndex(
      (c) => c.id === category.id
    );

    this.categories.splice(categoryIndex, 1);
  }

  async listWithPagination(
    page: number,
    sort?: string,
    search?: string
  ): Promise<IPaginationData> {
    const lastPage = Math.ceil(this.categories.length / 10);

    if (page > lastPage) {
      page = lastPage;
    }

    let categories = this.categories;

    if (search) {
      categories = this.categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case "asc":
        categories = this.categories.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case "desc":
        categories = this.categories.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
    }

    return {
      data: categories.slice((page - 1) * 10, page * 10),
      page,
      lastPage: lastPage,
      total: this.categories.length,
    };
  }
}
