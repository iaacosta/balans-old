import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class AddsOperationIdToTransactions1598371987717
  implements MigrationInterface {
  name = 'AddsOperationIdToTransactions1598371987717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultUuid = uuid();

    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "operationId" uuid NOT NULL DEFAULT '${defaultUuid}'`,
    );

    const users = (await queryRunner.query(`SELECT id FROM "user"`)) as {
      id: number;
    }[];

    const perUserOps = users.map(async ({ id }) => {
      const [rootAccount] = (await queryRunner.query(
        `SELECT id FROM account WHERE type = 'root' AND "userId" = ${id}`,
      )) as { id: number }[];

      const commonTransactions = (await queryRunner.query(`
        SELECT transaction."accountId", transaction.amount, transaction."resultantBalance"
        FROM transaction INNER JOIN account ON account.id = transaction."accountId"
        WHERE account.id != ${rootAccount.id}
        AND account."userId" = ${id}
      `)) as { accountId: number; amount: number; resultantBalance: number }[];

      for (const {
        accountId,
        amount,
        resultantBalance,
      } of commonTransactions) {
        await queryRunner.query(`
          UPDATE transaction
          SET "operationId" = '${uuid()}'
          WHERE "accountId" = ${accountId} 
            AND amount = ${amount} 
            AND "resultantBalance" = ${resultantBalance}
          OR "accountId" = ${rootAccount.id} 
            AND amount = ${-amount} 
            AND "resultantBalance" = ${-resultantBalance}
        `);
      }
    });

    await Promise.all(perUserOps);
    await queryRunner.query(`
      DELETE FROM transaction WHERE "operationId" = '${defaultUuid}';
    `);

    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "operationId" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "operationId"`,
    );
  }
}
