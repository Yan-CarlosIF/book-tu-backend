import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UsersCreate1753297346017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
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
            name: "registration",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "login",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "role",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "permission",
            type: "enum",
            enum: ["operator", "admin"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
