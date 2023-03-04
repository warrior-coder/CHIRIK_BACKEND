import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImages1673966618177 implements MigrationInterface {
    name = 'CreateImages1673966618177';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "images" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "recordId" integer,
                CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_d92f65a18048922c26dd8b50ecd" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_d92f65a18048922c26dd8b50ecd"
        `);
        await queryRunner.query(`
            DROP TABLE "images"
        `);
    }
}
