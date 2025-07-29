import { inject, injectable } from "tsyringe";

import { Category } from "../../infra/typeorm/entities/Category";
import { ICategoriesRepository } from "../../repositories/Icategories.repository";

@injectable()
export class ListCategoriesWithPaginationUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(page?: number, sort?: string) {
    if (!page || page < 1) {
      page = 1;
    }

    const paginatedCategories =
      await this.categoriesRepository.listWithPagination(page, sort);

    return {
      categories: paginatedCategories.data as Category[],
      page: paginatedCategories.page,
      lastPage: paginatedCategories.lastPage,
      total: paginatedCategories.total,
    };
  }
}
