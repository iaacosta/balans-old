import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPassives1605639410063 implements MigrationInterface {
    name = 'AddPassives1605639410063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passive" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "memo" character varying, "operationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" integer NOT NULL, "issuedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4bbd16160a537c20724636f74e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "passive" ADD CONSTRAINT "FK_0d0cca1391416adaa145cd8b4c5" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passive" DROP CONSTRAINT "FK_0d0cca1391416adaa145cd8b4c5"`);
        await queryRunner.query(`DROP TABLE "passive"`);
    }

}
