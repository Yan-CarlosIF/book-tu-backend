import { AppError } from "@/infra/errors/app-error";

import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { UpdateCategoryUseCase } from "./update-category.useCase";

describe("[PATCH] /categories/:id", () => {
  let categoriesRepository: CategoriesRepositoryInMemory;
  let updateCategoryUseCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    updateCategoryUseCase = new UpdateCategoryUseCase(categoriesRepository);
  });

  it("should be able to update a category", async () => {
    await categoriesRepository.create("Category 1");

    const { id } = categoriesRepository.categories[0];

    await updateCategoryUseCase.execute(id, "Category 2");

    expect(categoriesRepository.categories[0].name).toBe("Category 2");
  });

  it("should not be able to update a category that does not exist", async () => {
    await expect(
      updateCategoryUseCase.execute("invalid-id", "Category 2")
    ).rejects.toEqual(new AppError("Categoria não encontrada", 404));
  });

  it("should not be able to update a category with the same name", async () => {
    await categoriesRepository.create("Category 1");
    await categoriesRepository.create("Category 2");

    const { id } = categoriesRepository.categories[1];

    await expect(
      updateCategoryUseCase.execute(id, "Category 1")
    ).rejects.toEqual(new AppError("Categoria já cadastrada", 400));
  });

  it("should not be able to update a non-existent category", async () => {
    await expect(
      updateCategoryUseCase.execute("invalid-id", "Category 2")
    ).rejects.toEqual(new AppError("Categoria não encontrada", 404));
  });
});
