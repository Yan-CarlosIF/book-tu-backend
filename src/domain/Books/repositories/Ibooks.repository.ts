import { ICreateBookDTO } from "../dto/Icreate-book.dto";
import { IUpdateBookDTO } from "../dto/Iupdate-book.dto";
import { Book } from "../infra/typeorm/entities/Book";

export interface IBooksRepository {
  create(data: ICreateBookDTO): Promise<void>;
  findBookById(id: string): Promise<Book | undefined>;
  list(): Promise<Book[]>;
  update(Book: Book, data: IUpdateBookDTO): Promise<void>;
}
