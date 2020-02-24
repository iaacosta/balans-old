/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueNameToCurrency1582516401003 implements MigrationInterface {
  name = 'AddUniqueNameToCurrency1582516401003';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "currency" ADD CONSTRAINT "UQ_77f11186dd58a8d87ad5fff0246" UNIQUE ("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "currency" DROP CONSTRAINT "UQ_77f11186dd58a8d87ad5fff0246"`,
      undefined,
    );
  }
}
