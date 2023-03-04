import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditRecords1673817406539 implements MigrationInterface {
    name = 'EditRecords1673817406539';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_8834f3c19399bc9c9c69fd0e2af"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "parentRecordAuthorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf" FOREIGN KEY ("parentRecordId") REFERENCES "records"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "parentRecordAuthorId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf" FOREIGN KEY ("parentRecordId") REFERENCES "records"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_8834f3c19399bc9c9c69fd0e2af" FOREIGN KEY ("parentRecordAuthorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }
}
