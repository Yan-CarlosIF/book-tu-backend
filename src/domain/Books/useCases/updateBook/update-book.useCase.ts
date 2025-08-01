import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IBooksRepository } from "../../repositories/Ibooks.repository";
import { ICategoriesRepository } from "../../repositories/Icategories.repository";
import { IUpdateBookBody } from "./update-book.controller";

@injectable()
export class UpdateBookUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository,
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(
    id: string,
    {
      categoryIds,
      author,
      description,
      price,
      release_year,
      title,
    }: IUpdateBookBody
  ) {
    const bookExists = await this.booksRepository.findBookById(id);

    if (!bookExists) {
      throw new AppError("Book not found", 404);
    }

    let categories = bookExists.categories;

    if (categoryIds) {
      categories = await this.categoriesRepository.findByIds(categoryIds);

      if (categories.length !== categoryIds.length) {
        throw new AppError("One or more categories not found", 404);
      }
    }

    await this.booksRepository.update(bookExists, {
      author,
      description,
      price,
      release_year,
      title,
      categories,
    });
  }
}
