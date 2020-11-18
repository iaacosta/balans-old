import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLiquidatedColumnsToPassives1605730960957 implements MigrationInterface {
    name = 'AddLiquidatedColumnsToPassives1605730960957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passive" ADD "liquidated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "passive" ADD "liquidatedAccountId" integer`);
        await queryRunner.query(`ALTER TABLE "passive" ALTER COLUMN "liquidated" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "passive" ADD CONSTRAINT "FK_47f558017808ccc7cf8cb8069a2" FOREIGN KEY ("liquidatedAccountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passive" DROP CONSTRAINT "FK_47f558017808ccc7cf8cb8069a2"`);
        await queryRunner.query(`ALTER TABLE "passive" DROP COLUMN "liquidatedAccountId"`);
        await queryRunner.query(`ALTER TABLE "passive" DROP COLUMN "liquidated"`);
    }

}
