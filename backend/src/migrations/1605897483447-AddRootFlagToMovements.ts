import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRootFlagToMovements1605897483447 implements MigrationInterface {
    name = 'AddRootFlagToMovements1605897483447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "root" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "passive" ADD "root" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passive" DROP COLUMN "root"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "root"`);
    }

}
