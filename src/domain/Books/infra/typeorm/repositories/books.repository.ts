import { getRepository, Repository } from "typeorm";

import { ICreateBookDTO } from "@/domain/Books/dto/Icreate-book.dto";
import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";

import { Book } from "../entities/Book";

export class BooksRepository implements IBooksRepository {
  private repository: Repository<Book>;

  constructor() {
    this.repository = getRepository(Book);
  }

  async create(data: ICreateBookDTO): Promise<void> {
    const book = this.repository.create(data);

    await this.repository.save(book);
  }

  async findBookById(id: string): Promise<Book | undefined> {
    return await this.repository.findOne({ where: { id } });
  }

  async list(): Promise<Book[]> {
    return await this.repository.find();
  }
}
