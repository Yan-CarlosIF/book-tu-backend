import { v4 } from "uuid";

import { AppError } from "@/infra/errors/app-error";

import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { CreateBookUseCase } from "./create-book.useCase";

describe("[POST] /books", () => {
  let booksRepository: BooksRepositoryInMemory;
  let categoriesRepository: CategoriesRepositoryInMemory;
  let createBookUseCase: CreateBookUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    categoriesRepository = new CategoriesRepositoryInMemory();
    createBookUseCase = new CreateBookUseCase(
      booksRepository,
      categoriesRepository
    );
  });

  it("should be able to create a new book", async () => {
    await categoriesRepository.create("Category 1");

    await createBookUseCase.execute({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categoryIds: [],
    });

    expect(booksRepository.books[0]).toHaveProperty("id");
  });

  it("should be able to create a new book with a categories", async () => {
    await categoriesRepository.create("Category 1");

    await createBookUseCase.execute({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categoryIds: [categoriesRepository.categories[0].id],
    });

    expect(booksRepository.books[0]).toHaveProperty("id");
    expect(booksRepository.books.length).toBe(1);
    expect(booksRepository.books[0].categories[0]).toBe(
      categoriesRepository.categories[0]
    );
  });

  it("should not be able to create a new book with a category if the category does not exist", async () => {
    await expect(
      createBookUseCase.execute({
        title: "Book 1",
        identifier: "12314",
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categoryIds: [v4()],
      })
    ).rejects.toEqual(new AppError("One or more categories not found", 404));
  });

  it("should not be able to create a new book if identifier is already in use", async () => {
    await createBookUseCase.execute({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categoryIds: [],
    });

    await expect(
      createBookUseCase.execute({
        title: "Book 1",
        identifier: "12314",
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categoryIds: [],
      })
    ).rejects.toEqual(
      new AppError("Livro com o mesmo identificador já cadastrado", 409)
    );
  });
});
