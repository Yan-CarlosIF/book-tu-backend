import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { ICategoriesRepository } from "../../repositories/Icategories.repository";

@injectable()
export class DeleteCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    await this.categoriesRepository.delete(category);
  }
}
