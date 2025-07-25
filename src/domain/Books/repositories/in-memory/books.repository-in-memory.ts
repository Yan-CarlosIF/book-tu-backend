import { ICreateBookDTO } from "../../dto/Icreate-book.dto";
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
}
