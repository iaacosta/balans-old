import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUnliquidatedBalanceToAccounts1605565541101 implements MigrationInterface {
    name = 'AddUnliquidatedBalanceToAccounts1605565541101';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "unliquidatedBalance" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "unliquidatedBalance" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "unliquidatedBalance"`);
    }
}
