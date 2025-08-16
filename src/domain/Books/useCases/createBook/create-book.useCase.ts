import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IBooksRepository } from "../../repositories/Ibooks.repository";
import { ICategoriesRepository } from "../../repositories/Icategories.repository";
import { ICreateBookBody } from "./create-book.controller";

@injectable()
export class CreateBookUseCase {
  constructor(
    @inject("BooksRepository")
    private booksRepository: IBooksRepository,
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(data: ICreateBookBody) {
    const categories = await this.categoriesRepository.findByIds(
      data.categoryIds
    );

    if (categories.length !== data.categoryIds.length) {
      throw new AppError("One or more categories not found", 404);
    }

    const book = await this.booksRepository.findBookByIdentifier(
      data.identifier
    );

    if (book) {
      throw new AppError("Livro com o mesmo identificador já cadastrado", 409);
    }

    await this.booksRepository.create({
      title: data.title,
      identifier: data.identifier,
      author: data.author,
      release_year: data.release_year,
      price: data.price,
      description: data.description,
      categories,
    });
  }
}
