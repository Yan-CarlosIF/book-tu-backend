import { v4 } from "uuid";

import { AppError } from "@/infra/errors/app-error";

import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { DeleteBookUseCase } from "./delete-book.useCase";

describe("[DELETE] /books/:id", () => {
  let booksRepository: BooksRepositoryInMemory;
  let deleteBookUseCase: DeleteBookUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    deleteBookUseCase = new DeleteBookUseCase(booksRepository);
  });

  it("should be able to delete a book", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await deleteBookUseCase.execute(booksRepository.books[0].id);

    expect(booksRepository.books.length).toBe(0);
  });

  it("should not be able to delete a book if the book does not exist", async () => {
    await expect(deleteBookUseCase.execute(v4())).rejects.toEqual(
      new AppError("Livro não encontrado", 404)
    );
  });
});
