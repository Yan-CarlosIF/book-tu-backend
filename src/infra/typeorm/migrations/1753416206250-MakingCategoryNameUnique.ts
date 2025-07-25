import { MigrationInterface, QueryRunner } from "typeorm";

export class MakingCategoryNameUnique1753416206250
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE categories ADD CONSTRAINT UNQ_category_name UNIQUE (name)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE categories DROP CONSTRAINT UNQ_category_name`
    );
  }
}
