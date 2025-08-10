import { faker, fakerPT_BR } from "@faker-js/faker";
import { hash } from "bcryptjs";
import { getRepository } from "typeorm";
import { v4 } from "uuid";

import { Book } from "@/domain/Books/infra/typeorm/entities/Book";
import { Category } from "@/domain/Books/infra/typeorm/entities/Category";
import { Establishment } from "@/domain/Establishments/infra/typeorm/entities/Establishment";
import { Stock } from "@/domain/Establishments/infra/typeorm/entities/Stock";
import { StockItem } from "@/domain/Establishments/infra/typeorm/entities/StockItem";
import { Permission, User } from "@/domain/Users/infra/typeorm/entities/User";

import createConnection from "../index";
import { booksTitles } from "./seedBooks";
import { categoriesNames } from "./seedCategories";

async function seed() {
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

  await connection.close();
}

seed()
  .then(() => console.log("Seed finished"))
  .catch((err) => {
    console.error(err);
    console.error("Error during seed");
  });
