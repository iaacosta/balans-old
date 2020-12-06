import {MigrationInterface, QueryRunner} from "typeorm";

export class FixPassiveForeignKey1607275178210 implements MigrationInterface {
    name = 'FixPassiveForeignKey1607275178210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passive" DROP CONSTRAINT "FK_47f558017808ccc7cf8cb8069a2"`);
        await queryRunner.query(`ALTER TABLE "passive" ADD CONSTRAINT "FK_d57a9bd7e8f0c4322c8ebefe1e5" FOREIGN KEY ("liquidatedAccountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passive" DROP CONSTRAINT "FK_d57a9bd7e8f0c4322c8ebefe1e5"`);
        await queryRunner.query(`ALTER TABLE "passive" ADD CONSTRAINT "FK_47f558017808ccc7cf8cb8069a2" FOREIGN KEY ("liquidatedAccountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
