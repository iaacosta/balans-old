import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRootFlagToMovements1605897483447 implements MigrationInterface {
  name = 'AddRootFlagToMovements1605897483447';

  private async updateRootMovements(
    queryRunner: QueryRunner,
    data: {
      ids: number[];
      movementType: 'passive' | 'transaction';
    },
  ) {
    const ids = data.ids.join(', ');
    await queryRunner.query(
      `UPDATE "${data.movementType}" SET "root" = true, "memo" = '' WHERE "id" IN (${ids})`,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "root" boolean NOT NULL DEFAULT false`,
    );

    await queryRunner.query(
      `ALTER TABLE "passive" ADD "root" boolean NOT NULL DEFAULT false`,
    );

    const rootPassives: { id: number }[] = await queryRunner.query(
      `SELECT "id" FROM "passive" WHERE memo LIKE '%(root)%'`,
    );

    const rootTransactions: { id: number }[] = await queryRunner.query(
      `SELECT "id" FROM "transaction" WHERE memo LIKE '%(root)%'`,
    );

    if (rootTransactions.length > 0) {
      await this.updateRootMovements(queryRunner, {
        ids: rootTransactions.map(({ id }) => id),
        movementType: 'transaction',
      });
    }

    if (rootPassives.length > 0) {
      await this.updateRootMovements(queryRunner, {
        ids: rootPassives.map(({ id }) => id),
        movementType: 'passive',
      });
    }

    await queryRunner.query(
      `ALTER TABLE "passive" ALTER COLUMN "root" DROP DEFAULT`,
    );

    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "root" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "passive" DROP COLUMN "root"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "root"`);
  }
}
