import { IPaginationData } from "../../dto/Ipagination-data.dto";
import { ICreateBookDTO } from "../../dto/Icreate-book.dto";
import { IUpdateBookDTO } from "../../dto/Iupdate-book.dto";
import { Book } from "../../infra/typeorm/entities/Book";
import { IBooksRepository } from "../Ibooks.repository";

export class BooksRepositoryInMemory implements IBooksRepository {
  books: Book[] = [];

  async create(data: ICreateBookDTO): Promise<void> {
    const book = new Book();

    Object.assign(book, data);

    this.books.push(book);
  }

  async findBookById(id: string): Promise<Book | undefined> {
    return this.books.find((book) => book.id === id);
  }

  async list(): Promise<Book[]> {
    return this.books;
  }

  async update(book: Book, data: IUpdateBookDTO): Promise<void> {
    const bookIndex = this.books.findIndex((b) => b.id === book.id);

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...data,
    };
  }

  async delete(Book: Book): Promise<void> {
    const bookIndex = this.books.findIndex((b) => b.id === Book.id);

    this.books.splice(bookIndex, 1);
  }

  async listWithPagination(
    page: number,
    sort?: string
  ): Promise<IPaginationData> {
    let books = this.books;

    switch (sort) {
      case "asc":
        books = this.books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "desc":
        books = this.books.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "oldest":
        books = this.books.sort((a, b) => a.release_year - b.release_year);
        break;
      case "latest":
        books = this.books.sort((a, b) => b.release_year - a.release_year);
        break;
      case "price-asc":
        books = this.books.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        books = this.books.sort((a, b) => b.price - a.price);
        break;
    }

    const lastPage = Math.ceil(books.length / 10);

    if (page > lastPage) {
      page = lastPage;
    }

    return {
      data: books.slice((page - 1) * 10, page * 10),
      page,
      lastPage,
      total: this.books.length,
    };
  }
}
