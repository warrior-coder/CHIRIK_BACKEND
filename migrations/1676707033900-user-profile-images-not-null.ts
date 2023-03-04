import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfileImagesNotNull1676707033900 implements MigrationInterface {
    name = 'UserProfileImagesNotNull1676707033900';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_profile_images"
            ALTER COLUMN "avatarImageName"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_profile_images"
            ALTER COLUMN "coverImageName"
            SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_profile_images"
            ALTER COLUMN "coverImageName" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_profile_images"
            ALTER COLUMN "avatarImageName" DROP NOT NULL
        `);
    }
}
