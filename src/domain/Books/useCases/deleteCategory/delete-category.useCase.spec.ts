import { AppError } from "@/infra/errors/app-error";

import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { DeleteCategoryUseCase } from "./delete-category.useCase";

describe("[DELETE] /categories/:id", () => {
  let categoriesRepository: CategoriesRepositoryInMemory;
  let deleteCategoryUseCase: DeleteCategoryUseCase;

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    deleteCategoryUseCase = new DeleteCategoryUseCase(categoriesRepository);
  });

  it("should be able to delete a category", async () => {
    await categoriesRepository.create("Category 1");

    const { id } = categoriesRepository.categories[0];

    await deleteCategoryUseCase.execute(id);

    expect(categoriesRepository.categories.length).toBe(0);
  });

  it("should not be able to delete a category that does not exist", async () => {
    await expect(deleteCategoryUseCase.execute("invalid-id")).rejects.toEqual(
      new AppError("Categoria não encontrada", 404)
    );
  });
});
