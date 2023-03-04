import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseMaterializedPathTree1673957269649 implements MigrationInterface {
    name = 'UseMaterializedPathTree1673957269649';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "parentRecordId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "mpath" character varying DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "parentId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_cf5614748845646b9bba08655e4" FOREIGN KEY ("parentId") REFERENCES "records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_cf5614748845646b9bba08655e4"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "parentId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "mpath"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "parentRecordId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_9661e8a763b26a97fa928efc3bf" FOREIGN KEY ("parentRecordId") REFERENCES "records"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }
}
