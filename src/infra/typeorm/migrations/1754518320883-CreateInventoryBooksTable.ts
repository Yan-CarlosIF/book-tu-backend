import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInventoryBooksTable1754518320883
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "inventory_books",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "inventory_id",
            type: "uuid",
          },
          {
            name: "book_id",
            type: "uuid",
          },
          {
            name: "quantity",
            type: "integer",
          },
        ],
        foreignKeys: [
          {
            name: "FKInventoryBook",
            referencedTableName: "inventories",
            referencedColumnNames: ["id"],
            columnNames: ["inventory_id"],
            onDelete: "CASCADE",
          },
          {
            name: "FKBookInventory",
            referencedTableName: "books",
            referencedColumnNames: ["id"],
            columnNames: ["book_id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("inventory_books");
  }
}
