import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokensSessions1674238974477 implements MigrationInterface {
    name = 'CreateRefreshTokensSessions1674238974477';

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "records"
            ALTER COLUMN "isRetweet" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens_sessions"
            ADD CONSTRAINT "FK_0235d0892fdb17238ef636633a6" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens_sessions" DROP CONSTRAINT "FK_0235d0892fdb17238ef636633a6"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ALTER COLUMN "isRetweet"
            SET DEFAULT false
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens_sessions"
        `);
    }
}
