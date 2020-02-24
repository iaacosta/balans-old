/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrency1582514486420 implements MigrationInterface {
  name = 'AddCurrency1582514486420';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "currency" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "currency"`, undefined);
  }
}
