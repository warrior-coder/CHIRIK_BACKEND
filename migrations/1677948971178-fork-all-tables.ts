import { MigrationInterface, QueryRunner } from "typeorm";

export class forkAllTables1677948971178 implements MigrationInterface {
    name = 'forkAllTables1677948971178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "value" uuid NOT NULL,
                "sessionId" uuid NOT NULL,
                "userId" uuid,
                CONSTRAINT "UQ_1d2fa515f8af61c943f20aa22c9" UNIQUE ("value"),
                CONSTRAINT "UQ_b25a58a00578bd1b7a01623d2dd" UNIQUE ("sessionId"),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_profile_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "avatarImageName" character varying NOT NULL,
                "coverImageName" character varying NOT NULL,
                "userId" uuid,
                CONSTRAINT "REL_4f878cf9d80d17226d28aabc4a" UNIQUE ("userId"),
                CONSTRAINT "PK_901bd6ee021a50f09a083814f78" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "restrictions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "action" character varying,
                "subject" character varying,
                "targetUserId" uuid,
                "initiatorUserId" uuid,
                CONSTRAINT "PK_f86a9a487b1348b0349f104154e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" character varying NOT NULL,
                "userId" uuid,
                CONSTRAINT "PK_1d8dd7ffa37c3ab0c4eefb0b221" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "isComment" boolean NOT NULL,
                "isRetweet" boolean NOT NULL,
                "text" text NOT NULL,
                "isDeleted" boolean NOT NULL DEFAULT false,
                "mpath" character varying DEFAULT '',
                "parentId" uuid,
                "authorId" uuid,
                CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "recordId" uuid,
                CONSTRAINT "PK_8da97547c56544ed29d9e60c728" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_likes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "recordId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_7fc237a7c15256bbebe2820ad5f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_profile_images"
            ADD CONSTRAINT "FK_4f878cf9d80d17226d28aabc4a1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions"
            ADD CONSTRAINT "FK_c1b9fe729d128c858295d43a913" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions"
            ADD CONSTRAINT "FK_641b80d50072b093e6f6b07aade" FOREIGN KEY ("initiatorUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_cf5614748845646b9bba08655e4" FOREIGN KEY ("parentId") REFERENCES "records"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "record_images"
            ADD CONSTRAINT "FK_817bfa383884b7418feb84383e2" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "record_images" DROP CONSTRAINT "FK_817bfa383884b7418feb84383e2"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_cf5614748845646b9bba08655e4"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions" DROP CONSTRAINT "FK_641b80d50072b093e6f6b07aade"
        `);
        await queryRunner.query(`
            ALTER TABLE "restrictions" DROP CONSTRAINT "FK_c1b9fe729d128c858295d43a913"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_profile_images" DROP CONSTRAINT "FK_4f878cf9d80d17226d28aabc4a1"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            DROP TABLE "record_likes"
        `);
        await queryRunner.query(`
            DROP TABLE "record_images"
        `);
        await queryRunner.query(`
            DROP TABLE "records"
        `);
        await queryRunner.query(`
            DROP TABLE "users_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "restrictions"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "user_profile_images"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
    }

}
