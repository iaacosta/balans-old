import {MigrationInterface, QueryRunner} from "typeorm";

export class AddsTransferModel1599005062430 implements MigrationInterface {
    name = 'AddsTransferModel1599005062430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "accountId" integer NOT NULL, "memo" character varying, "operationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_dc08c75a8d44994061c438c7b62" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_dc08c75a8d44994061c438c7b62"`);
        await queryRunner.query(`DROP TABLE "transfer"`);
    }

}
