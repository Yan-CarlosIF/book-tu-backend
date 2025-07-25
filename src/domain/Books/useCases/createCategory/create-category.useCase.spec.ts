import { AppError } from "@/infra/errors/app-error";

import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { CreateCategoryUseCase } from "./create-category.useCase";

describe("[POST] /categories", () => {
  let categoriesRepository: CategoriesRepositoryInMemory;
  let createCategoryUseCase: CreateCategoryUseCase;

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository);
  });

  it("should be able to create a new category", async () => {
    await createCategoryUseCase.execute("Category 1");

    expect(categoriesRepository.categories.length).toBe(1);
    expect(categoriesRepository.categories[0].name).toBe("Category 1");
    expect(categoriesRepository.categories[0]).toHaveProperty("id");
  });

  it("should not be able to create a new category with the same name", async () => {
    await createCategoryUseCase.execute("Category 1");

    await expect(createCategoryUseCase.execute("Category 1")).rejects.toEqual(
      new AppError("Category already exists", 400)
    );
  });
});
