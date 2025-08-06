import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStocksTable1754518907774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "stocks",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "book_id",
            type: "uuid",
          },
          {
            name: "establishment_id",
            type: "uuid",
          },
          {
            name: "quantity",
            type: "integer",
          },
        ],
        foreignKeys: [
          {
            name: "FKBookStock",
            referencedTableName: "books",
            referencedColumnNames: ["id"],
            columnNames: ["book_id"],
            onDelete: "CASCADE",
          },
          {
            name: "FKEstablishmentStock",
            referencedTableName: "establishments",
            referencedColumnNames: ["id"],
            columnNames: ["establishment_id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("stocks");
  }
}
