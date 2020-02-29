import { MigrationInterface, QueryRunner } from 'typeorm';

export class UnifyAccountsIntoOneModel1582901933693
  implements MigrationInterface {
  name = 'UnifyAccountsIntoOneModel1582901933693';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "bank" character varying NOT NULL, "initialBalance" integer NOT NULL, "billingDay" integer NOT NULL, "paymentDay" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "currencyId" integer, CONSTRAINT "UQ_414d4052f22837655ff312168cb" UNIQUE ("name"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_f6cf13404290564d6992f5e4158" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_f6cf13404290564d6992f5e4158"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "account"`, undefined);
  }
}
