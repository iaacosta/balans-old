import {MigrationInterface, QueryRunner} from "typeorm";

export class AddsMemoToTransaction1598313940959 implements MigrationInterface {
    name = 'AddsMemoToTransaction1598313940959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "memo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "memo"`);
    }

}
