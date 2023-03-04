import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserName1675883868196 implements MigrationInterface {
    name = 'AddUserName1675883868196';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "name" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "name"
        `);
    }
}
