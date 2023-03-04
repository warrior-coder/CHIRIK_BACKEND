import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsRetweet1674077706979 implements MigrationInterface {
    name = 'AddIsRetweet1674077706979';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "isRetweet" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "isRetweet"
        `);
    }
}
