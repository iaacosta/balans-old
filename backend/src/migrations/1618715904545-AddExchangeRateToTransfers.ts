import {MigrationInterface, QueryRunner} from "typeorm";

export class AddExchangeRateToTransfers1618715904545 implements MigrationInterface {
    name = 'AddExchangeRateToTransfers1618715904545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" ADD "operationExchangeRate" double precision NOT NULL DEFAULT 1.0`);
        await queryRunner.query(`ALTER TABLE "transfer" ALTER COLUMN "operationExchangeRate" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" DROP COLUMN "operationExchangeRate"`);
    }

}
