import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInventoriesTable1754517518175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "inventories",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "identifier",
            type: "serial",
            isUnique: true,
          },
          {
            name: "total_quantity",
            type: "integer",
          },
          {
            name: "establishment_id",
            type: "uuid",
          },
          {
            name: "status",
            type: "enum",
            enum: ["processed", "unprocessed"],
            default: `'unprocessed'`,
          },
        ],
        foreignKeys: [
          {
            name: "FKInventoryEstablishment",
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
    await queryRunner.dropTable("inventories");
  }
}
