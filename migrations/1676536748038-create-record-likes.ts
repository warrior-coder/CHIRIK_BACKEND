import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecordLikes1676536748038 implements MigrationInterface {
    name = 'CreateRecordLikes1676536748038';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "record_likes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "recordId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_7fc237a7c15256bbebe2820ad5f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "record_likes"
            ADD CONSTRAINT "FK_78669e428583937598fa9432d89" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "record_likes"
            ADD CONSTRAINT "FK_eaacf95bd9c112619abaccdaa9d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "record_likes" DROP CONSTRAINT "FK_eaacf95bd9c112619abaccdaa9d"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_likes" DROP CONSTRAINT "FK_78669e428583937598fa9432d89"
        `);
        await queryRunner.query(`
            DROP TABLE "record_likes"
        `);
    }
}
