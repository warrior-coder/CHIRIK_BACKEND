import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProfileImages1676545534134 implements MigrationInterface {
    name = 'CreateUserProfileImages1676545534134';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_profile_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "avatarImageName" character varying,
                "coverImageName" character varying,
                "userId" uuid,
                CONSTRAINT "REL_4f878cf9d80d17226d28aabc4a" UNIQUE ("userId"),
                CONSTRAINT "PK_901bd6ee021a50f09a083814f78" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_profile_images"
            ADD CONSTRAINT "FK_4f878cf9d80d17226d28aabc4a1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_profile_images" DROP CONSTRAINT "FK_4f878cf9d80d17226d28aabc4a1"
        `);
        await queryRunner.query(`
            DROP TABLE "user_profile_images"
        `);
    }
}
