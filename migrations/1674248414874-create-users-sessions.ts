import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersSessions1674248414874 implements MigrationInterface {
    name = 'CreateUsersSessions1674248414874';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens_sessions" DROP CONSTRAINT "FK_0235d0892fdb17238ef636633a6"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens_sessions"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            CREATE TABLE "users_sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sessionId" uuid NOT NULL,
                "userId" uuid,
                "refreshTokenId" uuid,
                CONSTRAINT "REL_88358370a1587b83f90ad38676" UNIQUE ("refreshTokenId"),
                CONSTRAINT "PK_d3108356d1e8d8473a4f8be7ca6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_sessions"
            ADD CONSTRAINT "FK_ad63321c2184aaf101482a8b4a1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users_sessions"
            ADD CONSTRAINT "FK_88358370a1587b83f90ad386767" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh_tokens"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_sessions" DROP CONSTRAINT "FK_88358370a1587b83f90ad386767"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_sessions" DROP CONSTRAINT "FK_ad63321c2184aaf101482a8b4a1"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "userId" uuid
        `);
        await queryRunner.query(`
            DROP TABLE "users_sessions"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens_sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sessionId" uuid NOT NULL,
                "refreshTokenId" uuid,
                CONSTRAINT "REL_0235d0892fdb17238ef636633a" UNIQUE ("refreshTokenId"),
                CONSTRAINT "PK_ed8df25ac0085f4c73d7c115c53" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens_sessions"
            ADD CONSTRAINT "FK_0235d0892fdb17238ef636633a6" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
