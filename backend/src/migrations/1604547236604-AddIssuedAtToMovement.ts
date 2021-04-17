import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIssuedAtToMovement1604547236604 implements MigrationInterface {
  name = 'AddIssuedAtToMovement1604547236604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "issuedAt" TIMESTAMP NOT NULL DEFAULT 'NOW()'`,
    );

    await queryRunner.query(
      `ALTER TABLE "transfer" ADD "issuedAt" TIMESTAMP NOT NULL DEFAULT 'NOW()'`,
    );

    await queryRunner.query(
      `UPDATE "transaction" SET "issuedAt" = "createdAt"`,
    );

    await queryRunner.query(`UPDATE "transfer" SET "issuedAt" = "createdAt"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transfer" DROP COLUMN "issuedAt"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "issuedAt"`);
  }
}
