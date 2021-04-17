import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatesRootAccounts1597526491976 implements MigrationInterface {
  name = 'CreatesRootAccounts1597526491976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: { id: number }[] = await queryRunner.query(
      `SELECT id FROM "user"`,
    );

    /* Create all root accounts for existing users */
    await Promise.all(
      users.map(({ id }) =>
        queryRunner.query(
          `INSERT INTO "account"("name", "bank", "balance", "type", "userId") VALUES ('Root account', 'Balans', 0, 'root', ${id});`,
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "account" WHERE type = 'root'`);
  }
}
