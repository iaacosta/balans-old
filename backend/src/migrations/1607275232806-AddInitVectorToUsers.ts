import { MigrationInterface, QueryRunner } from 'typeorm';
import { randomBytes } from 'crypto';

export class AddInitVectorToUsers1607275232806 implements MigrationInterface {
  name = 'AddInitVectorToUsers1607275232806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "initVector" character varying NOT NULL DEFAULT '00'`,
    );

    const users: { id: string }[] = await queryRunner.query(
      'SELECT id FROM "user"',
    );

    await Promise.all(
      users.map(({ id }) => {
        const vector = randomBytes(16).toString('hex');
        return queryRunner.query(
          `UPDATE "user" SET "initVector" = '${vector}' WHERE "id" = ${id}`,
        );
      }),
    );

    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "initVector" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "initVector"`);
  }
}
