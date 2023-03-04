import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRestrictions1674577230743 implements MigrationInterface {
    name = 'CreateRestrictions1674577230743';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "restrictions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "action" character varying,
                "subject" character varying,
                "targetUserId" uuid,
                "initiatorUserId" uuid,
                CONSTRAINT "PK_f86a9a487b1348b0349f104154e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions"
            ADD CONSTRAINT "FK_c1b9fe729d128c858295d43a913" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions"
            ADD CONSTRAINT "FK_641b80d50072b093e6f6b07aade" FOREIGN KEY ("initiatorUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "restrictions" DROP CONSTRAINT "FK_641b80d50072b093e6f6b07aade"
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions" DROP CONSTRAINT "FK_c1b9fe729d128c858295d43a913"
        `);
        await queryRunner.query(`
            DROP TABLE "restrictions"
        `);
    }
}
