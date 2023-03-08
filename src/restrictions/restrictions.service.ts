import { Injectable } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { UserRestrictionsEntity } from './entities/user-restrictions.entity';

@Injectable()
export class RestrictionsService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public async createRestrictionToReadRecordsForUser(
        action: string,
        subject: string,
        userId: number,
        restrictedUserId: number,
    ): Promise<UserRestrictionsEntity> {
        const insertedRows: UserRestrictionsEntity[] = await this.pgConnection.rows<UserRestrictionsEntity>(
            `
                INSERT INTO public.user_restrictions("action", "subject", user_id, restricted_user_id)
                VALUES ($1::VARCHAR(16), $2::VARCHAR(16), $3::INT, $4::INT)
                RETURNING id, "action", "subject", user_id, restricted_user_id;
            `,
            [action, subject, userId, restrictedUserId],
        );
        const userRestriction: UserRestrictionsEntity = insertedRows[0];

        return userRestriction;
    }
}
