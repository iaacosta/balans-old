import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreditAccountAndRelationshipWithCurrency1582568439328
  implements MigrationInterface {
  name = 'AddCreditAccountAndRelationshipWithCurrency1582568439328';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "credit_account" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bank" character varying NOT NULL, "initialBalance" integer NOT NULL, "billingDay" integer NOT NULL, "paymentDay" integer NOT NULL, "currencyId" integer, CONSTRAINT "UQ_ae29168a72818e20f4bf16dbcf6" UNIQUE ("name"), CONSTRAINT "PK_6b742e3ee1ec0edf7acc66ba80a" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_account" ADD CONSTRAINT "FK_6b5d3dfd39376546035858e53d7" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "credit_account" DROP CONSTRAINT "FK_6b5d3dfd39376546035858e53d7"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "credit_account"`, undefined);
  }
}
