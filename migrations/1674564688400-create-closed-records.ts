import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClosedRecords1674564688400 implements MigrationInterface {
    name = 'CreateClosedRecords1674564688400';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "closed_records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "recordId" uuid,
                "fromUserId" uuid,
                "authorId" uuid,
                CONSTRAINT "PK_4d7e9b180ea4280b30bb5578a05" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "closed_records"
            ADD CONSTRAINT "FK_1804a8852c5cc68d8873afd0512" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "closed_records"
            ADD CONSTRAINT "FK_ec5c8347dc45cbcfef30e45b253" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "closed_records"
            ADD CONSTRAINT "FK_d15f4bb99707d6d9b4b4a196173" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "closed_records" DROP CONSTRAINT "FK_d15f4bb99707d6d9b4b4a196173"
        `);
        await queryRunner.query(`
            ALTER TABLE "closed_records" DROP CONSTRAINT "FK_ec5c8347dc45cbcfef30e45b253"
        `);
        await queryRunner.query(`
            ALTER TABLE "closed_records" DROP CONSTRAINT "FK_1804a8852c5cc68d8873afd0512"
        `);
        await queryRunner.query(`
            DROP TABLE "closed_records"
        `);
    }
}
