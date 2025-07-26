import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IBooksRepository } from "../../repositories/Ibooks.repository";

@injectable()
export class DeleteBookUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository
  ) {}

  async execute(id: string) {
    const bookExists = await this.booksRepository.findBookById(id);

    if (!bookExists) {
      throw new AppError("Book not found", 404);
    }

    await this.booksRepository.delete(bookExists);
  }
}
