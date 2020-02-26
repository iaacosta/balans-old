import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeActionOnCurrency1582670831397
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE debit_account DROP CONSTRAINT "FK_48b480d1f92524185a9b27b8808";',
    );
    await queryRunner.query(
      'ALTER TABLE credit_account DROP CONSTRAINT "FK_6b5d3dfd39376546035858e53d7";',
    );

    await queryRunner.query(
      'ALTER TABLE debit_account ADD CONSTRAINT "FK_48b480d1f92524185a9b27b8808" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE SET NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE credit_account ADD CONSTRAINT "FK_6b5d3dfd39376546035858e53d7" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE SET NULL;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE debit_account DROP CONSTRAINT "FK_48b480d1f92524185a9b27b8808";',
    );
    await queryRunner.query(
      'ALTER TABLE credit_account DROP CONSTRAINT "FK_6b5d3dfd39376546035858e53d7";',
    );

    await queryRunner.query(
      `ALTER TABLE "debit_account" ADD CONSTRAINT "FK_48b480d1f92524185a9b27b8808" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_account" ADD CONSTRAINT "FK_6b5d3dfd39376546035858e53d7" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }
}
