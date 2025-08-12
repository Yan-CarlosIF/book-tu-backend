import { faker, fakerPT_BR } from "@faker-js/faker";
import { hash } from "bcryptjs";
import { getRepository } from "typeorm";
import { v4 } from "uuid";

import { Book } from "@/domain/Books/infra/typeorm/entities/Book";
import { Category } from "@/domain/Books/infra/typeorm/entities/Category";
import { Establishment } from "@/domain/Establishments/infra/typeorm/entities/Establishment";
import {
  Inventory,
  Status,
} from "@/domain/Establishments/infra/typeorm/entities/Inventory";
import { InventoryBooks } from "@/domain/Establishments/infra/typeorm/entities/InventoryBooks";
import { Stock } from "@/domain/Establishments/infra/typeorm/entities/Stock";
import { StockItem } from "@/domain/Establishments/infra/typeorm/entities/StockItem";
import { Permission, User } from "@/domain/Users/infra/typeorm/entities/User";

import createConnection from "../index";
import { booksTitles } from "./seedBooks";
import { categoriesNames } from "./seedCategories";

export async function seed() {
  const connection = await createConnection("localhost");
  await connection.dropDatabase();
  await connection.runMigrations();

  const hashedPassword = await hash("123", 8);

  const usersRepository = getRepository(User);
  const booksRepository = getRepository(Book);
  const categoriesRepository = getRepository(Category);
  const establishmentsRepository = getRepository(Establishment);
  const stocksRepository = getRepository(Stock);
  const stockItemsRepository = getRepository(StockItem);
  const inventoriesRepository = getRepository(Inventory);
  const inventoryBooksRepository = getRepository(InventoryBooks);

  // ---------- Usuários ----------
  const admin = usersRepository.create({
    name: "Administrator",
    login: "admin-test",
    password: hashedPassword,
    registration: "14343564236",
    role: "first admin",
    permission: Permission.ADMIN,
  });

  const users = usersRepository.create(
    Array.from({
      length: 10,
    }).map((_, __) => ({
      name: fakerPT_BR.person.firstName(),
      login: faker.internet.displayName(),
      password: hashedPassword,
      registration: v4(),
      role: "user",
      permission: Permission.OPERATOR,
    }))
  );

  // ---------- Categorias ----------
  const categories = categoriesRepository.create(
    categoriesNames.map((name) => ({
      name,
    }))
  );

  await usersRepository.save([admin, ...users]);
  await categoriesRepository.save(categories);

  // ---------- Livros ----------
  const books = booksRepository.create(
    booksTitles.map((title) => {
      const randomCategories = faker.helpers.arrayElements(
        categories,
        faker.number.int({ min: 1, max: 3 })
      );

      return {
        title,
        author: fakerPT_BR.person.firstName(),
        release_year: fakerPT_BR.date.past().getFullYear(),
        price: faker.number.float({ min: 10, max: 100 }),
        description: fakerPT_BR.lorem.sentence(),
        categories: randomCategories,
      };
    })
  );

  await booksRepository.save(books);

  // ---------- Estabelecimentos ----------
  const establishments = establishmentsRepository.create(
    Array.from({ length: 5 }).map(() => ({
      name: fakerPT_BR.company.name(),
      cnpj: fakerPT_BR.helpers.replaceSymbols("##.###.###/####-##"),
      state: fakerPT_BR.location.state(),
      city: fakerPT_BR.location.city(),
      district: fakerPT_BR.location.county(),
      cep: fakerPT_BR.location.zipCode(),
      description: fakerPT_BR.company.catchPhrase(),
    }))
  );

  await establishmentsRepository.save(establishments);

  // ---------- Estoques ----------
  const stocks = stocksRepository.create(
    establishments.map((est) => {
      const stock = new Stock();
      stock.establishment_id = est.id;
      return stock;
    })
  );

  await stocksRepository.save(stocks);

  // ---------- Itens do estoque ----------
  const stockItems: StockItem[] = [];

  for (const stock of stocks) {
    const randomBooks = faker.helpers.arrayElements(
      books,
      faker.number.int({ min: 5, max: books.length })
    );

    for (const book of randomBooks) {
      stockItems.push(
        stockItemsRepository.create({
          stock_id: stock.id,
          book_id: book.id,
          quantity: faker.number.int({ min: 1, max: 50 }),
        })
      );
    }
  }

  await stockItemsRepository.save(stockItems);

  // ---------- Inventários ----------
  const inventories: Inventory[] = [];
  const inventoryBooks: InventoryBooks[] = [];

  for (const est of establishments) {
    // cria entre 1 e 3 inventários por estabelecimento
    const numInventories = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numInventories; i++) {
      const inventory = inventoriesRepository.create({
        establishment_id: est.id,
        total_quantity: 0,
        status: Status.UNPROCESSED,
      });

      inventories.push(inventory);
    }
  }

  await inventoriesRepository.save(inventories);

  // vincula livros aos inventários
  for (const inv of inventories) {
    const randomBooks = faker.helpers.arrayElements(
      books,
      faker.number.int({ min: 2, max: 5 })
    );

    let total = 0;

    for (const book of randomBooks) {
      const quantity = faker.number.int({ min: 1, max: 20 });
      total += quantity;

      inventoryBooks.push(
        inventoryBooksRepository.create({
          inventory_id: inv.id,
          book_id: book.id,
          quantity,
        })
      );
    }

    // atualiza total_quantity
    inv.total_quantity = total;
  }

  await inventoriesRepository.save(inventories);
  await inventoryBooksRepository.save(inventoryBooks);

  return connection;
}
