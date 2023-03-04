import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsDelete1675020741623 implements MigrationInterface {
    name = 'AddIsDelete1675020741623';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "isDeleted" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "isDeleted"
        `);
    }
}
