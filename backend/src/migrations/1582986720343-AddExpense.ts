import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpense1582986720343 implements MigrationInterface {
  name = 'AddExpense1582986720343';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" SERIAL NOT NULL, "amount" double precision NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "installments" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer, "subCategoryId" integer, "placeId" integer, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_015435528d9ddf9dd6ee01f172d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_7b5c2a6e287837279c1daf54a70" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_43a085294f47ef8a6635dd46699" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_43a085294f47ef8a6635dd46699"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_7b5c2a6e287837279c1daf54a70"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_015435528d9ddf9dd6ee01f172d"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "expense"`, undefined);
  }
}
