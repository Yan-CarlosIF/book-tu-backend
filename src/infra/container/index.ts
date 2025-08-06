import { container } from "tsyringe";

import { BooksRepository } from "@/domain/Books/infra/typeorm/repositories/books.repository";
import { CategoriesRepository } from "@/domain/Books/infra/typeorm/repositories/categories.repository";
import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";
import { ICategoriesRepository } from "@/domain/Books/repositories/Icategories.repository";
import { EstablishmentsRepository } from "@/domain/Establishments/infra/typeorm/repositories/establishments.repository";
import { IEstablishmentsRepository } from "@/domain/Establishments/repositories/Iestablishments.repository";
import { UsersRepository } from "@/domain/Users/infra/typeorm/repositories/users.repository";
import { IUsersRepository } from "@/domain/Users/repositories/Iusers.repository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IBooksRepository>(
  "BooksRepository",
  BooksRepository
);

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
);

container.registerSingleton<IEstablishmentsRepository>(
  "EstablishmentsRepository",
  EstablishmentsRepository
);
