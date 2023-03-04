import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecords1673440614708 implements MigrationInterface {
    name = 'CreateRecords1673440614708';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "records" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "isComment" boolean NOT NULL,
                "text" text NOT NULL,
                "authorId" integer,
                "parentRecordAuthorId" integer,
                "parentRecordId" integer,
                CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_8834f3c19399bc9c9c69fd0e2af" FOREIGN KEY ("parentRecordAuthorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf" FOREIGN KEY ("parentRecordId") REFERENCES "records"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_8834f3c19399bc9c9c69fd0e2af"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"
        `);
        await queryRunner.query(`
            DROP TABLE "records"
        `);
    }
}
