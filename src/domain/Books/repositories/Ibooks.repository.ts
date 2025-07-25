import { ICreateBookDTO } from "../dto/Icreate-book.dto";
import { Book } from "../infra/typeorm/entities/Book";

export interface IBooksRepository {
  create(data: ICreateBookDTO): Promise<void>;
  findBookById(id: string): Promise<Book | undefined>;
}
