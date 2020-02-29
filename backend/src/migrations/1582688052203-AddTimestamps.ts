import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestamps1582688052203 implements MigrationInterface {
  name = 'AddTimestamps1582688052203';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "credit_account" DROP COLUMN "updatedAt"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_account" DROP COLUMN "createdAt"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" DROP COLUMN "updatedAt"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" DROP COLUMN "createdAt"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "debit_account" DROP COLUMN "updatedAt"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "debit_account" DROP COLUMN "createdAt"`,
      undefined,
    );
  }
}
