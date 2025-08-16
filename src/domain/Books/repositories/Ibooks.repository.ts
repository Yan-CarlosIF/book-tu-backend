import { ICreateBookDTO } from "../dto/Icreate-book.dto";
import { IPaginationData } from "../dto/Ipagination-data.dto";
import { IUpdateBookDTO } from "../dto/Iupdate-book.dto";
import { Book } from "../infra/typeorm/entities/Book";

export interface IBooksRepository {
  create(data: ICreateBookDTO): Promise<void>;
  findBookById(id: string): Promise<Book | undefined>;
  findBooksByIds(ids: string[]): Promise<Book[]>;
  findBookByIdentifier(identifier: string): Promise<Book | undefined>;
  list(): Promise<Book[]>;
  listWithPagination(page: number, sort?: string): Promise<IPaginationData>;
  update(Book: Book, data: IUpdateBookDTO): Promise<void>;
  delete(Book: Book): Promise<void>;
}
