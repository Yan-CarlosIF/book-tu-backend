import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTriggerToUpdateInventoryQuantity1754518617100
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_total_quantity()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE inventories
        SET total_quantity = (
          SELECT COALESCE(SUM(quantity), 0)
          FROM inventory_books
          WHERE inventory_id = NEW.inventory_id
        )
        WHERE id = NEW.inventory_id;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_inventory_books_insert
      AFTER INSERT ON inventory_books
      FOR EACH ROW
      EXECUTE FUNCTION update_total_quantity();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_inventory_books_update
      AFTER UPDATE ON inventory_books
      FOR EACH ROW
      EXECUTE FUNCTION update_total_quantity();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_inventory_books_delete
      AFTER DELETE ON inventory_books
      FOR EACH ROW
      EXECUTE FUNCTION update_total_quantity();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_inventory_books_insert ON inventory_books`
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_inventory_books_update ON inventory_books`
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_inventory_books_delete ON inventory_books`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_total_quantity`);
  }
}
