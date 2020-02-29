import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIncome1582907239792 implements MigrationInterface {
  name = 'AddIncome1582907239792';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "income" ("id" SERIAL NOT NULL, "amount" double precision NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer, "subCategoryId" integer, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_278726c015edbc72a6c1b3196ea" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_b777a4f1f5d66ab3e1b240531de" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_b777a4f1f5d66ab3e1b240531de"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_278726c015edbc72a6c1b3196ea"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "income"`, undefined);
  }
}
