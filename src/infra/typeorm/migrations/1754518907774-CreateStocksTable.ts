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
            name: "establishment_id",
            type: "uuid",
            isUnique: true,
          },
        ],
        foreignKeys: [
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
