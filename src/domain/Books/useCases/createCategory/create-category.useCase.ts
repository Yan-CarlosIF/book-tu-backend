import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { ICategoriesRepository } from "../../repositories/Icategories.repository";

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(name: string) {
    const categoryExists = await this.categoriesRepository.findByName(name);

    if (categoryExists) {
      throw new AppError("Categoria já cadastrada", 400);
    }

    await this.categoriesRepository.create(name);
  }
}
