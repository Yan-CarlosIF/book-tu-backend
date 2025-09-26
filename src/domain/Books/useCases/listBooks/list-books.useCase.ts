import { inject, injectable } from "tsyringe";

import { IBooksRepository } from "../../repositories/Ibooks.repository";

@injectable()
export class ListBooksUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository
  ) {}

  async execute(search?: string) {
    return this.booksRepository.list(search);
  }
}
