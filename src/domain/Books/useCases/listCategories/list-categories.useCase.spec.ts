import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { ListCategoriesUseCase } from "./list-categories.useCase";

describe("[GET] /categories/all", () => {
  let categoriesRepository: CategoriesRepositoryInMemory;
  let listCategoriesUseCase: ListCategoriesUseCase;

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository);

    for (let i = 0; i < 10; i++) {
      categoriesRepository.create(`Category ${i + 1}`);
    }
  });

  it("should be able to list all categories", async () => {
    const categories = await listCategoriesUseCase.execute();

    expect(categories.length).toBe(10);
  });
});
