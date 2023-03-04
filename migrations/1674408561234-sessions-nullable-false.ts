import { MigrationInterface, QueryRunner } from 'typeorm';

export class SessionsNullableFalse1674408561234 implements MigrationInterface {
    name = 'SessionsNullableFalse1674408561234';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ALTER COLUMN "value"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ALTER COLUMN "sessionId"
            SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ALTER COLUMN "sessionId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ALTER COLUMN "value" DROP NOT NULL
        `);
    }
}
