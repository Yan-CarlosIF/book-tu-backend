import { v4 } from "uuid";

import { AppError } from "@/infra/errors/app-error";

import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/categories.repository-in-memory";
import { UpdateBookUseCase } from "./update-book.useCase";

describe("[PATCH] /books/:id", () => {
  let booksRepository: BooksRepositoryInMemory;
  let categoriesRepository: CategoriesRepositoryInMemory;
  let updateBookUseCase: UpdateBookUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    categoriesRepository = new CategoriesRepositoryInMemory();
    updateBookUseCase = new UpdateBookUseCase(
      booksRepository,
      categoriesRepository
    );
  });

  it("should be able to update a book", async () => {
    await booksRepository.create({
      title: "Book 1",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await updateBookUseCase.execute(booksRepository.books[0].id, {
      title: "Book 2",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
    });

    expect(booksRepository.books[0]).toEqual({
      id: expect.any(String),
      title: "Book 2",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
      categories: [],
    });
  });

  it("should not be able to update a book if the book does not exist", async () => {
    await expect(
      updateBookUseCase.execute(v4(), {
        title: "Book 2",
        author: "Author 2",
        release_year: 2001,
        price: 20,
        description: "Description 2",
      })
    ).rejects.toEqual(new AppError("Book not found", 404));
  });

  it("should not be able to update a book with a category if the category does not exist", async () => {
    await booksRepository.create({
      title: "Book 1",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await expect(
      updateBookUseCase.execute(booksRepository.books[0].id, {
        title: "Book 2",
        author: "Author 2",
        release_year: 2001,
        price: 20,
        description: "Description 2",
        categoryIds: [v4()],
      })
    ).rejects.toEqual(new AppError("One or more categories not found", 404));
  });
});
