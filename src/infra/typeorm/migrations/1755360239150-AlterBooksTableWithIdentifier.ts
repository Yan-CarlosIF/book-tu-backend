import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterBooksTableWithIdentifier1755360239150
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "books",
      new TableColumn({
        name: "identifier",
        type: "varchar",
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("books", "identifier");
  }
}
