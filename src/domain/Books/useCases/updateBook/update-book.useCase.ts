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
      identifier,
      author,
      description,
      price,
      release_year,
      title,
    }: IUpdateBookBody
  ) {
    const bookExists = await this.booksRepository.findBookById(id);

    if (!bookExists) {
      throw new AppError("Livro não encontrado", 404);
    }

    let categories = bookExists.categories;

    if (categoryIds) {
      categories = await this.categoriesRepository.findByIds(categoryIds);

      if (categories.length !== categoryIds.length) {
        throw new AppError("Uma ou mais categorias não foram encontradas", 404);
      }
    }

    if (identifier && identifier !== bookExists.identifier) {
      const book = await this.booksRepository.findBookByIdentifier(identifier);

      if (book && book.id !== id) {
        throw new AppError(
          "Livro com o mesmo identificador já cadastrado",
          409
        );
      }
    }

    await this.booksRepository.update(bookExists, {
      author,
      identifier,
      description,
      price,
      release_year,
      title,
      categories,
    });
  }
}
