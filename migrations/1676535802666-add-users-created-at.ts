import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersCreatedAt1676535802666 implements MigrationInterface {
    name = 'AddUsersCreatedAt1676535802666';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "createdAt"
        `);
    }
}
