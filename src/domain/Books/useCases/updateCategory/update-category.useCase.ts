import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { ICategoriesRepository } from "../../repositories/Icategories.repository";

@injectable()
export class UpdateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(id: string, name: string) {
    const category = await this.categoriesRepository.findById(id);
    const categoryExists = await this.categoriesRepository.findByName(name);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    if (categoryExists && categoryExists.id !== id) {
      throw new AppError("Categoria já cadastrada", 400);
    }

    await this.categoriesRepository.update(category, name);
  }
}
