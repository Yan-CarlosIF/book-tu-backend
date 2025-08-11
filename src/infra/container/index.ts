import { container } from "tsyringe";

import { BooksRepository } from "@/domain/Books/infra/typeorm/repositories/books.repository";
import { CategoriesRepository } from "@/domain/Books/infra/typeorm/repositories/categories.repository";
import { IBooksRepository } from "@/domain/Books/repositories/Ibooks.repository";
import { ICategoriesRepository } from "@/domain/Books/repositories/Icategories.repository";
import { EstablishmentsRepository } from "@/domain/Establishments/infra/typeorm/repositories/establishments.repository";
import { InventoriesRepository } from "@/domain/Establishments/infra/typeorm/repositories/inventories.repository";
import { StocksRepository } from "@/domain/Establishments/infra/typeorm/repositories/stocks.repository";
import { IEstablishmentsRepository } from "@/domain/Establishments/repositories/Iestablishments.repository";
import { IInventoriesRepository } from "@/domain/Establishments/repositories/Iinventories.repository";
import { IStocksRepository } from "@/domain/Establishments/repositories/Istocks.repository";
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

container.registerSingleton<IStocksRepository>(
  "StocksRepository",
  StocksRepository
);

container.registerSingleton<IInventoriesRepository>(
  "InventoriesRepository",
  InventoriesRepository
);
