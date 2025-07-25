import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBookCategoriesTable1753413752457
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "book_categories",
        columns: [
          {
            name: "book_id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "category_id",
            type: "uuid",
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            name: "FKBookCategory",
            referencedTableName: "books",
            referencedColumnNames: ["id"],
            columnNames: ["book_id"],
            onDelete: "CASCADE",
          },
          {
            name: "FKCategoryBook",
            referencedTableName: "categories",
            referencedColumnNames: ["id"],
            columnNames: ["category_id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("book_categories");
  }
}
