import { inject, injectable } from "tsyringe";

import { pagination } from "@/utils/pagination";

import { Book } from "../../infra/typeorm/entities/Book";
import { IBooksRepository } from "../../repositories/Ibooks.repository";

interface IResponse {
  data: Book[];
  page: number;
  total: number;
  lastPage: number;
}

@injectable()
export class ListBooksUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository
  ) {}

  async execute(
    sort?:
      | "asc"
      | "desc"
      | "release-asc"
      | "release-desc"
      | "price-asc"
      | "price-desc",
    page?: number
  ): Promise<IResponse> {
    const allBooks = await this.booksRepository.list();

    let books = allBooks;

    switch (sort) {
      case "asc":
        books = allBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "desc":
        books = allBooks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "release-asc":
        books = allBooks.sort((a, b) => a.release_year - b.release_year);
        break;
      case "release-desc":
        books = allBooks.sort((a, b) => b.release_year - a.release_year);
        break;
      case "price-asc":
        books = allBooks.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        books = allBooks.sort((a, b) => b.price - a.price);
        break;
    }

    if (!page || page < 1) {
      page = 1;
    }

    return pagination<Book>(books, page, 10);
  }
}
