import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokens1673032548381 implements MigrationInterface {
    name = 'CreateRefreshTokens1673032548381';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" SERIAL NOT NULL,
                "value" character varying NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9" UNIQUE ("value"),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
    }
}
