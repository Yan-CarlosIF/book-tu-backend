import { ICreateBookDTO } from "../../dto/Icreate-book.dto";
import { Book } from "../../infra/typeorm/entities/Book";
import { IBooksRepository } from "../Ibooks.repository";

export class BooksInMemoryRepository implements IBooksRepository {
  books: Book[] = [];

  async create(data: ICreateBookDTO): Promise<void> {
    const book = new Book();

    Object.assign(book, data);

    this.books.push(book);
  }

  async findBookById(id: string): Promise<Book | undefined> {
    return this.books.find((book) => book.id === id);
  }
}
