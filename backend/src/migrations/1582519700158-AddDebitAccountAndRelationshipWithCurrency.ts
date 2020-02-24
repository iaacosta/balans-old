import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDebitAccountAndRelationshipWithCurrency1582519700158
  implements MigrationInterface {
  name = 'AddDebitAccountAndRelationshipWithCurrency1582519700158';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "debit_account" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bank" character varying NOT NULL, "initialBalance" integer NOT NULL, "allowsNegative" boolean NOT NULL, "currencyId" integer, CONSTRAINT "UQ_d5f59b440e006143c36ab8fb8d1" UNIQUE ("name"), CONSTRAINT "PK_56940533c8a9bbd0b659e9418e4" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "debit_account" ADD CONSTRAINT "FK_48b480d1f92524185a9b27b8808" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "debit_account" DROP CONSTRAINT "FK_48b480d1f92524185a9b27b8808"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "debit_account"`, undefined);
  }
}
