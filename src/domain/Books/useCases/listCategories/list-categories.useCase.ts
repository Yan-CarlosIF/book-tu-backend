import { inject, injectable } from "tsyringe";

import { pagination } from "@/utils/pagination";

import { Category } from "../../infra/typeorm/entities/Category";
import { ICategoriesRepository } from "../../repositories/Icategories.repository";

interface IResponse {
  data: Category[];
  total: number;
  page: number;
  lastPage: number;
}

@injectable()
export class ListCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(page?: number): Promise<IResponse> {
    const categories = await this.categoriesRepository.list();

    if (!page || page < 1) {
      page = 1;
    }

    return pagination<Category>(categories, page, 10);
  }
}
