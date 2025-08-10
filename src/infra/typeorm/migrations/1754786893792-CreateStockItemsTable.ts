import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateStockItemsTable1754786893792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "stock_items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "stock_id",
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
            name: "FKStockItem",
            referencedTableName: "stocks",
            referencedColumnNames: ["id"],
            columnNames: ["stock_id"],
            onDelete: "CASCADE",
          },
          {
            name: "FKBookStockItem",
            referencedTableName: "books",
            referencedColumnNames: ["id"],
            columnNames: ["book_id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "stock_items",
      new TableIndex({
        name: "IDXBookStockUnique",
        columnNames: ["book_id", "stock_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("stock_items", "IDXBookStockUnique");
    await queryRunner.dropTable("stock_items");
  }
}
