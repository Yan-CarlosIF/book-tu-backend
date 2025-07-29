import { inject, injectable } from "tsyringe";

import { Book } from "../../infra/typeorm/entities/Book";
import { IBooksRepository } from "../../repositories/Ibooks.repository";

@injectable()
export class ListBooksWithPaginationUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository
  ) {}

  async execute(page?: number, sort?: string) {
    if (!page || page < 1) {
      page = 1;
    }

    const paginatedBooks = await this.booksRepository.listWithPagination(
      page,
      sort
    );

    return {
      books: paginatedBooks.data as Book[],
      page: paginatedBooks.page,
      lastPage: paginatedBooks.lastPage,
      total: paginatedBooks.total,
    };
  }
}
