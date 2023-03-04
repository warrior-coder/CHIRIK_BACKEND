import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUsersSessions1674399443375 implements MigrationInterface {
    name = 'RemoveUsersSessions1674399443375';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_sessions" DROP CONSTRAINT "FK_88358370a1587b83f90ad386767"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_sessions" DROP CONSTRAINT "FK_ad63321c2184aaf101482a8b4a1"
        `);
        await queryRunner.query(`
            DROP TABLE "users_sessions"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "sessionId" uuid DEFAULT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "UQ_b25a58a00578bd1b7a01623d2dd" UNIQUE ("sessionId")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "userId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "value"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "value" uuid DEFAULT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9" UNIQUE ("value")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "value"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "value" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9" UNIQUE ("value")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_b25a58a00578bd1b7a01623d2dd"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "sessionId"
        `);
    }
}
