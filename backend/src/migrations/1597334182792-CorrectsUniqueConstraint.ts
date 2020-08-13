import {MigrationInterface, QueryRunner} from "typeorm";

export class CorrectsUniqueConstraint1597334182792 implements MigrationInterface {
    name = 'CorrectsUniqueConstraint1597334182792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_414d4052f22837655ff312168cb"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_f233b613882581e0ffe4a0ec0a4" UNIQUE ("name", "bank")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_f233b613882581e0ffe4a0ec0a4"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_414d4052f22837655ff312168cb" UNIQUE ("name")`);
    }

}
