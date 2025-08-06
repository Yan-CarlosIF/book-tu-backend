import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEstablishmentsTable1754517043993
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "establishments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "cnpj",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "state",
            type: "varchar",
          },
          {
            name: "city",
            type: "varchar",
          },
          {
            name: "district",
            type: "varchar",
          },
          {
            name: "cep",
            type: "varchar",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Establishments");
  }
}
