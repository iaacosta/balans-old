import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlace1582827579291 implements MigrationInterface {
  name = 'AddPlace1582827579291';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "place" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "photoUri" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "place"`, undefined);
  }
}
