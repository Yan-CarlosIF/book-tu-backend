import { BooksRepositoryInMemory } from "../../repositories/in-memory/books.repository-in-memory";
import { ListBooksUseCase } from "./list-books.useCase";

describe("[GET] /books", () => {
  let booksRepository: BooksRepositoryInMemory;
  let listBooksUseCase: ListBooksUseCase;

  beforeEach(() => {
    booksRepository = new BooksRepositoryInMemory();
    listBooksUseCase = new ListBooksUseCase(booksRepository);
  });

  it("should be able to list all books", async () => {
    await booksRepository.create({
      title: "Book 1",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await booksRepository.create({
      title: "Book 2",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
      categories: [],
    });

    const books = await listBooksUseCase.execute();

    expect(books.data.length).toBe(2);

    expect(books.data[0]).toHaveProperty("id");
    expect(books.data[0]).toHaveProperty("title");
  });

  it("should be able to list all books with pagination", async () => {
    for (let i = 0; i < 20; i++) {
      await booksRepository.create({
        title: `Book ${i + 1}`,
        author: "Author 1",
        release_year: 2000,
        price: 10,
        description: "Description 1",
        categories: [],
      });
    }

    const books = await listBooksUseCase.execute(undefined, 10);

    expect(books.data.length).toBe(10);
    expect(books.data[0]).toHaveProperty("id");
    expect(books.data[0].title).toBe("Book 11");
  });

  it("should be able to list all books with filters", async () => {
    await booksRepository.create({
      title: "Book 1",
      author: "Author 1",
      release_year: 2000,
      price: 10,
      description: "Description 1",
      categories: [],
    });

    await booksRepository.create({
      title: "Book 2",
      author: "Author 2",
      release_year: 2001,
      price: 20,
      description: "Description 2",
      categories: [],
    });

    const books = await listBooksUseCase.execute("asc", 1);

    expect(books.data[0].title).toBe("Book 1");

    const books2 = await listBooksUseCase.execute("desc", 1);

    expect(books2.data[0].title).toBe("Book 2");

    const books3 = await listBooksUseCase.execute("release-asc", 1);

    expect(books3.data[0].title).toBe("Book 1");

    const books4 = await listBooksUseCase.execute("release-desc", 1);

    expect(books4.data[0].title).toBe("Book 2");

    const books5 = await listBooksUseCase.execute("price-asc", 1);

    expect(books5.data[0].title).toBe("Book 1");

    const books6 = await listBooksUseCase.execute("price-desc", 1);

    expect(books6.data[0].title).toBe("Book 2");
  });
});
