import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "../../repositories/Icategories.repository";

@injectable()
export class ListCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute() {
    return await this.categoriesRepository.list();
  }
}
