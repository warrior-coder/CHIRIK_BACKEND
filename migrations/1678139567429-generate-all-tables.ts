import { MigrationInterface, QueryRunner } from "typeorm";

export class generateAllTables1678139567429 implements MigrationInterface {
    name = 'generateAllTables1678139567429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_images" (
                "id" SERIAL NOT NULL,
                "file_name" character varying NOT NULL,
                "record_id" integer,
                CONSTRAINT "UQ_ae44f141b5570b85a172e021313" UNIQUE ("file_name"),
                CONSTRAINT "PK_8da97547c56544ed29d9e60c728" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "records" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "text" text NOT NULL,
                "author_id" integer,
                CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_comments" (
                "id" SERIAL NOT NULL,
                "text" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "author_id" integer,
                "record_id" integer,
                CONSTRAINT "PK_08c0c95bb35bc4f1566bfc07434" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "record_likes" (
                "id" SERIAL NOT NULL,
                "record_id" integer,
                "user_id" integer,
                CONSTRAINT "PK_7fc237a7c15256bbebe2820ad5f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "record_images"
            ADD CONSTRAINT "FK_c992d73dd3fed857df16386e636" FOREIGN KEY ("record_id") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_2a7bfcd86c4e9a0d70645bdd6fc" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments"
            ADD CONSTRAINT "FK_c33be995b72dc273af0b768478b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments"
            ADD CONSTRAINT "FK_f8eae37de21062a8194281ec0e0" FOREIGN KEY ("record_id") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "record_likes"
            ADD CONSTRAINT "FK_662300d8f3bce980ee7d1115707" FOREIGN KEY ("record_id") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "record_likes"
            ADD CONSTRAINT "FK_18d78aec30f1bd0eb2b1beee034" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "record_likes" DROP CONSTRAINT "FK_18d78aec30f1bd0eb2b1beee034"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_likes" DROP CONSTRAINT "FK_662300d8f3bce980ee7d1115707"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments" DROP CONSTRAINT "FK_f8eae37de21062a8194281ec0e0"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_comments" DROP CONSTRAINT "FK_c33be995b72dc273af0b768478b"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_2a7bfcd86c4e9a0d70645bdd6fc"
        `);
        await queryRunner.query(`
            ALTER TABLE "record_images" DROP CONSTRAINT "FK_c992d73dd3fed857df16386e636"
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
            DROP TABLE "users"
        `);
    }

}
