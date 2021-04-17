import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeUniquenessOfCategory1604848133456 implements MigrationInterface {
    name = 'ChangeUniquenessOfCategory1604848133456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_4760fde1380c4d39297a2e1f98c"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_9c02d63f9578dcd8e1543a132de" UNIQUE ("name", "userId", "type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_9c02d63f9578dcd8e1543a132de"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_4760fde1380c4d39297a2e1f98c" UNIQUE ("name", "userId")`);
    }

}
