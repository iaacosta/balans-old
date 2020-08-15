import {MigrationInterface, QueryRunner} from "typeorm";

export class IncludesUserInAccountUniqueness1597526372950 implements MigrationInterface {
    name = 'IncludesUserInAccountUniqueness1597526372950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_f233b613882581e0ffe4a0ec0a4"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_a65ea8b3384b4391cc6930ebc6f" UNIQUE ("name", "bank", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_a65ea8b3384b4391cc6930ebc6f"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_f233b613882581e0ffe4a0ec0a4" UNIQUE ("name", "bank")`);
    }

}
