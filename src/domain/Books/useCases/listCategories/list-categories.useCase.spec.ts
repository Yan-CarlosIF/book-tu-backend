import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { ListCategoriesUseCase } from "./list-categories.useCase";

describe("[GET] /categories", () => {
  let categoriesRepository: CategoriesRepositoryInMemory;
  let listCategoriesUseCase: ListCategoriesUseCase;

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository);
  });

  it("should be able to list all categories", async () => {
    await categoriesRepository.create("Category 1");
    await categoriesRepository.create("Category 2");

    const { data: categories } = await listCategoriesUseCase.execute();

    expect(categories.length).toBe(2);
    expect(categories[0]).toHaveProperty("id");
    expect(categories[0].name).toBe("Category 1");
    expect(categories[1]).toHaveProperty("id");
    expect(categories[1].name).toBe("Category 2");
  });
});
