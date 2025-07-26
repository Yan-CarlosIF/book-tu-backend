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
}
