import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { ListBooksWithPaginationUseCase } from "./list-books-with-pagination.useCase";

describe("[GET] /books", () => {
  let booksRepository: BooksRepositoryInMemory;
  let listBooksWithPaginationUseCase: ListBooksWithPaginationUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    listBooksWithPaginationUseCase = new ListBooksWithPaginationUseCase(
      booksRepository
    );
  });

  it("should be able to list all books", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12314",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await booksRepository.create({
      title: "Book 2",
      identifier: "123145",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
      categories: [],
    });

    const data = await listBooksWithPaginationUseCase.execute();

    expect(data.books.length).toBe(2);

    expect(data.books[0]).toHaveProperty("id");
    expect(data.books[0]).toHaveProperty("title");
  });

  it("should be able to list all books with pagination", async () => {
    for (let i = 0; i < 20; i++) {
      await booksRepository.create({
        title: `Book ${i + 1}`,
        identifier: `12314${i + 1}`,
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categories: [],
      });
    }

    const data = await listBooksWithPaginationUseCase.execute(10, undefined);

    expect(data.books.length).toBe(10);
    expect(data.books[0]).toHaveProperty("id");
    expect(data.books[0].title).toBe("Book 11");
  });

  it("should be able to list all books with filters", async () => {
    await booksRepository.create({
      title: "Book 1",
      identifier: "12315",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await booksRepository.create({
      title: "Book 2",
      identifier: "123161",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
      categories: [],
    });

    const books = await listBooksWithPaginationUseCase.execute(1, "asc");

    expect(books.books[0].title).toBe("Book 1");

    const books2 = await listBooksWithPaginationUseCase.execute(1, "desc");

    expect(books2.books[0].title).toBe("Book 2");

    const books3 = await listBooksWithPaginationUseCase.execute(1, "oldest");

    expect(books3.books[0].title).toBe("Book 1");

    const books4 = await listBooksWithPaginationUseCase.execute(1, "latest");

    expect(books4.books[0].title).toBe("Book 2");

    const books5 = await listBooksWithPaginationUseCase.execute(1, "price-asc");

    expect(books5.books[0].title).toBe("Book 1");

    const books6 = await listBooksWithPaginationUseCase.execute(
      1,
      "price-desc"
    );

    expect(books6.books[0].title).toBe("Book 2");
  });
});
