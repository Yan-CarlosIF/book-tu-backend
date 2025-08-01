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

    await this.booksRepository.create({
      title: data.title,
      author: data.author,
      release_year: data.release_year,
      price: data.price,
      description: data.description,
      categories,
    });
  }
}
