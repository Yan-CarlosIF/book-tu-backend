import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IBooksRepository } from "../../repositories/Ibooks.repository";

@injectable()
export class GetBookUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository
  ) {}

  async execute(id: string) {
    const book = await this.booksRepository.findBookById(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  }
}
