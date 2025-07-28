import { faker, fakerPT_BR } from "@faker-js/faker";
import { hash } from "bcryptjs";
import { getRepository } from "typeorm";
import { v4 } from "uuid";

import { Book } from "@/domain/Books/infra/typeorm/entities/Book";
import { Category } from "@/domain/Books/infra/typeorm/entities/Category";
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

  const categories = categoriesRepository.create(
    categoriesNames.map((name) => ({
      name,
    }))
  );

  await usersRepository.save([admin, ...users]);
  await categoriesRepository.save(categories);

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

  await connection.close();
}

seed()
  .then(() => console.log("Seed finished"))
  .catch((err) => {
    console.error(err);
    console.error("Error during seed");
  });
