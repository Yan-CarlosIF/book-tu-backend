import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { ListCategoriesWithPaginationUseCase } from "./list-categories-with-pagination.useCase";

describe("[GET] /categories", () => {
  let categoriesRepository: CategoriesRepositoryInMemory;
  let listCategoriesUseCase: ListCategoriesWithPaginationUseCase;

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesWithPaginationUseCase(
      categoriesRepository
    );
  });

  it("should be able to list all categories", async () => {
    await categoriesRepository.create("Category 1");
    await categoriesRepository.create("Category 2");

    const { categories } = await listCategoriesUseCase.execute();

    expect(categories.length).toBe(2);
    expect(categories[0]).toHaveProperty("id");
    expect(categories[0].name).toBe("Category 1");
    expect(categories[1]).toHaveProperty("id");
    expect(categories[1].name).toBe("Category 2");
  });
});
