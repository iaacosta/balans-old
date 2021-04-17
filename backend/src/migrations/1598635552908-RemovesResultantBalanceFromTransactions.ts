import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovesResultantBalanceFromTransactions1598635552908 implements MigrationInterface {
    name = 'RemovesResultantBalanceFromTransactions1598635552908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "resultantBalance"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "resultantBalance" integer NOT NULL`);
    }

}
