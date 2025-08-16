CREATE TABLE "Users" (
  "id" uuid PRIMARY KEY,
  "name" varchar NOT NULL,
  "registration" varchar UNIQUE NOT NULL,
  "login" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "role" varchar,
  "permission" enum(admin,operator) NOT NULL
);

CREATE TABLE "Books" (
  "id" uuid PRIMARY KEY,
  "identifier" varchar UNIQUE NOT NULL,
  "title" varchar UNIQUE NOT NULL,
  "author" varchar NOT NULL,
  "release_year" int NOT NULL,
  "price" decimal(10,2) NOT NULL,
  "description" text
);

CREATE TABLE "Categories" (
  "id" uuid PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "Book_categories" (
  "book_id" uuid NOT NULL,
  "category_id" uuid NOT NULL,
  PRIMARY KEY ("book_id", "category_id")
);

CREATE TABLE "Establishments" (
  "id" uuid PRIMARY KEY,
  "name" varchar NOT NULL,
  "cnpj" varchar UNIQUE NOT NULL,
  "state" varchar NOT NULL,
  "city" varchar NOT NULL,
  "district" varchar NOT NULL,
  "cep" varchar NOT NULL,
  "description" text
);

CREATE TABLE "Stock" (
  "id" uuid PRIMARY KEY,
  "establishment_id" uuid UNIQUE NOT NULL
);

CREATE TABLE "Stock_Item" (
  "id" uuid PRIMARY KEY,
  "book_id" uuid NOT NULL,
  "stock_id" uuid NOT NULL,
  "quantity" int NOT NULL
);

CREATE TABLE "Inventories" (
  "id" uuid PRIMARY KEY,
  "identifier" serial UNIQUE NOT NULL,
  "total_quantity" int NOT NULL,
  "establishment_id" uuid NOT NULL,
  "status" enum(processed,unprocessed)
);

CREATE TABLE "Inventory_books" (
  "id" uuid PRIMARY KEY,
  "inventory_id" uuid NOT NULL,
  "book_id" uuid NOT NULL,
  "quantity" int NOT NULL
);

CREATE UNIQUE INDEX ON "Stock_Item" ("book_id", "stock_id");

ALTER TABLE "Book_categories" ADD FOREIGN KEY ("book_id") REFERENCES "Books" ("id");

ALTER TABLE "Book_categories" ADD FOREIGN KEY ("category_id") REFERENCES "Categories" ("id");

ALTER TABLE "Stock" ADD FOREIGN KEY ("establishment_id") REFERENCES "Establishments" ("id");

ALTER TABLE "Stock_Item" ADD FOREIGN KEY ("stock_id") REFERENCES "Stock" ("id");

ALTER TABLE "Stock_Item" ADD FOREIGN KEY ("book_id") REFERENCES "Books" ("id");

ALTER TABLE "Inventories" ADD FOREIGN KEY ("establishment_id") REFERENCES "Establishments" ("id");

ALTER TABLE "Inventory_books" ADD FOREIGN KEY ("book_id") REFERENCES "Books" ("id");

ALTER TABLE "Inventory_books" ADD FOREIGN KEY ("inventory_id") REFERENCES "Inventories" ("id");