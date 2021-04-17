import {MigrationInterface, QueryRunner} from "typeorm";

export class AddsCurrencyToAccounts1617471265200 implements MigrationInterface {
    name = 'AddsCurrencyToAccounts1617471265200'

    private async userIds(queryRunner: QueryRunner) {
      const queryResult: { id: number }[] = await queryRunner.query(`SELECT id FROM "user";`);
      return queryResult.map(({ id }) => id);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_a65ea8b3384b4391cc6930ebc6f"`);

        await queryRunner.query(`ALTER TABLE "account" ADD "currency" character varying NOT NULL DEFAULT 'CLP'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "currency" DROP DEFAULT`);

        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_2becee51ca9a6123b90d8bc3662" UNIQUE ("name", "bank", "userId", "currency")`);

        const accountsValues = (await this.userIds(queryRunner)).map((id) => 
          `('root', 'Root account', 'Balans', 'USD', ${id}, 0, 0)`,
        );

        if (accountsValues.length === 0) return;

        await queryRunner.query(`
          INSERT INTO "account"("type", "name", "bank", "currency", "userId", "balance", "unliquidatedBalance")
          VALUES ${accountsValues.join(',')}
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_2becee51ca9a6123b90d8bc3662"`);
      await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "currency"`);
      await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_a65ea8b3384b4391cc6930ebc6f" UNIQUE ("name", "bank", "userId")`);
    }

}
