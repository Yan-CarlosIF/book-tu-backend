import { v4 } from "uuid";

import { AppError } from "@/infra/errors/app-error";

import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { GetBookUseCase } from "./get-book.useCase";

describe("[GET] /books/:id", () => {
  let booksRepository: BooksRepositoryInMemory;
  let getBookUseCase: GetBookUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    getBookUseCase = new GetBookUseCase(booksRepository);
  });

  it("should be able to get a book information by id", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    const book = await getBookUseCase.execute(booksRepository.books[0].id);

    expect(book).toHaveProperty("id");
    expect(book!.title).toBe("Book 1");
  });

  it("should not be able do get a book that does not exists", async () => {
    await expect(getBookUseCase.execute(v4())).rejects.toEqual(
      new AppError("Livro não encontrado", 404)
    );
  });
});
