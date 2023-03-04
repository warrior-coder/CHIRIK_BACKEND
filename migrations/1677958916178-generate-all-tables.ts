import { MigrationInterface, QueryRunner } from "typeorm";

export class generateAllTables1677958916178 implements MigrationInterface {
    name = 'generateAllTables1677958916178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" SERIAL NOT NULL,
                "value" uuid NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9" UNIQUE ("value"),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "id" SERIAL NOT NULL,
                "roleValue" character varying NOT NULL,
                "userId" integer,
                CONSTRAINT "PK_1d8dd7ffa37c3ab0c4eefb0b221" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_images" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "recordId" integer,
                CONSTRAINT "PK_8da97547c56544ed29d9e60c728" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "records" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "text" text NOT NULL,
                "authorId" integer,
                CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_comments" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "text" text NOT NULL,
                "authorId" integer,
                "recordId" integer,
                CONSTRAINT "PK_08c0c95bb35bc4f1566bfc07434" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_likes" (
                "id" SERIAL NOT NULL,
                "recordId" integer,
                "userId" integer,
                CONSTRAINT "PK_7fc237a7c15256bbebe2820ad5f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "record_images"
            ADD CONSTRAINT "FK_817bfa383884b7418feb84383e2" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments"
            ADD CONSTRAINT "FK_95d19907c049382e412461cf786" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments"
            ADD CONSTRAINT "FK_e5d19335d3a9bc568d652974dfe" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE
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
            ALTER TABLE "record_comments" DROP CONSTRAINT "FK_e5d19335d3a9bc568d652974dfe"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments" DROP CONSTRAINT "FK_95d19907c049382e412461cf786"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_images" DROP CONSTRAINT "FK_817bfa383884b7418feb84383e2"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            DROP TABLE "record_likes"
        `);
        await queryRunner.query(`
            DROP TABLE "record_comments"
        `);
        await queryRunner.query(`
            DROP TABLE "records"
        `);
        await queryRunner.query(`
            DROP TABLE "record_images"
        `);
        await queryRunner.query(`
            DROP TABLE "users_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
    }

}
