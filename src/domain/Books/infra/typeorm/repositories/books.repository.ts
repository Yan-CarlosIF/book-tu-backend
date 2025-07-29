import { getRepository, Repository } from "typeorm";

import { ICreateBookDTO } from "@/domain/Books/dto/Icreate-book.dto";
import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { IUpdateBookDTO } from "@/domain/Books/dto/Iupdate-book.dto";
import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";
import { pagination } from "@/utils/pagination";

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
    return await this.repository.find({ relations: ["categories"] });
  }

  async update(book: Book, data: IUpdateBookDTO): Promise<void> {
    const bookIndex = this.repository.merge(book, data);

    await this.repository.save(bookIndex);
  }

  async delete(Book: Book): Promise<void> {
    await this.repository.delete(Book.id);
  }

  async listWithPagination(
    page: number,
    sort?: string
  ): Promise<IPaginationData> {
    const queryBuilder = this.repository.createQueryBuilder("books");

    switch (sort) {
      case "asc":
        queryBuilder.orderBy("books.title", "ASC");
        break;
      case "desc":
        queryBuilder.orderBy("books.title", "DESC");
        break;
      case "oldest":
        queryBuilder.orderBy("books.release_year", "ASC");
        break;
      case "latest":
        queryBuilder.orderBy("books.release_year", "DESC");
        break;
      case "price-asc":
        queryBuilder.orderBy("books.price", "ASC");
        break;
      case "price-desc":
        queryBuilder.orderBy("books.price", "DESC");
        break;
    }

    return await pagination<Book>(queryBuilder, page, 10);
  }
}
