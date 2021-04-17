import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDefaultIssuedAtOnMovements1604848047017
  implements MigrationInterface {
  name = 'FixDefaultIssuedAtOnMovements1604848047017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "issuedAt" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer" ALTER COLUMN "issuedAt" SET DEFAULT NOW()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfer" ALTER COLUMN "issuedAt" SET DEFAULT 'NOW()'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "issuedAt" SET DEFAULT 'NOW()'`,
    );
  }
}
