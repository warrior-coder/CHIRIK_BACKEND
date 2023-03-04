import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntToUuid1674070066593 implements MigrationInterface {
    name = 'IntToUuid1674070066593';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_447389c0c9dcc190dc22a379e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "FK_cf5614748845646b9bba08655e4"
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
            ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "PK_7d8bee0204106019488c4c50ffa"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "userId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "PK_188149422ee2454660abf1d5ee5" CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "parentId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "parentId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "authorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "authorId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "authorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "authorId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "parentId"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "parentId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP CONSTRAINT "PK_188149422ee2454660abf1d5ee5"
        `);
        await queryRunner.query(`
            ALTER TABLE "records" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "userId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "PK_7d8bee0204106019488c4c50ffa"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            DROP TABLE "record_images"
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_cf5614748845646b9bba08655e4" FOREIGN KEY ("parentId") REFERENCES "records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "records"
            ADD CONSTRAINT "FK_447389c0c9dcc190dc22a379e81" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
}
