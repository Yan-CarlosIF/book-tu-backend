import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { ListBooksUseCase } from "./list-books.useCase";

describe("[GET] /books/all", () => {
  let booksRepository: BooksRepositoryInMemory;
  let listBooksUseCase: ListBooksUseCase;

  beforeAll(() => {
    booksRepository = new BooksRepositoryInMemory();
    listBooksUseCase = new ListBooksUseCase(booksRepository);

    for (let i = 0; i < 10; i++) {
      booksRepository.create({
        title: `Book ${i + 1}`,
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categories: [],
      });
    }
  });

  it("should be able to list all books", async () => {
    const books = await listBooksUseCase.execute();

    expect(books.length).toBe(10);
  });
});
