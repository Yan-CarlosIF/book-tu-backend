import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class InventoryIndentifierToIntegerIncrement1754922687443
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("inventories", "identifier");

    await queryRunner.addColumn(
      "inventories",
      new TableColumn({
        name: "identifier",
        type: "integer",
        isGenerated: true,
        generationStrategy: "increment",
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("inventories", "identifier");

    await queryRunner.addColumn(
      "inventories",
      new TableColumn({
        name: "identifier",
        type: "serial",
        isUnique: true,
      })
    );
  }
}
