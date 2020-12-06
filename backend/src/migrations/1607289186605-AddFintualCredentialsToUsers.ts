import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFintualCredentialsToUsers1607289186605 implements MigrationInterface {
    name = 'AddFintualCredentialsToUsers1607289186605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fintualEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "fintualToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fintualToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fintualEmail"`);
    }

}
