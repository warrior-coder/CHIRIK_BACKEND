import { ForbiddenException, Injectable } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { UserRestrictionsEntity } from '../entities/user-restrictions.entity';

@Injectable()
export class RestrictionsService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public async createRestrictionForUser(
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

    public async getIsRestricted(
        action: string,
        subject: string,
        userId: number,
        restrictedUserId: number,
    ): Promise<boolean> {
        const queryResultRows: boolean[] = await this.pgConnection.rows<boolean>(
            `
                SELECT EXISTS(
                    SELECT ur.*
                    FROM public.user_restrictions AS ur
                    WHERE ur."action" = $1::VARCHAR(16)
                        AND ur."subject" = $2::VARCHAR(16)
                        AND ur.user_id = $3::INT
                        AND ur.restricted_user_id = $4::INT
                ) AS is_restricted;
            `,
            [action, subject, userId, restrictedUserId],
        );

        return queryResultRows.length > 0;
    }

    public async throwForbiddenExceptionIfRestricted(
        action: string,
        subject: string,
        userId: number,
        restrictedUserId: number,
    ): Promise<void> {
        const queryResultRows: boolean[] = await this.pgConnection.rows<boolean>(
            `
                SELECT EXISTS(
                    SELECT ur.*
                    FROM public.user_restrictions AS ur
                    WHERE ur."action" = $1::VARCHAR(16)
                        AND ur."subject" = $2::VARCHAR(16)
                        AND ur.user_id = $3::INT
                        AND ur.restricted_user_id = $4::INT
                ) AS is_restricted;
            `,
            [action, subject, userId, restrictedUserId],
        );

        if (queryResultRows.length > 0) {
            throw new ForbiddenException(`Forbidden to \"${action}\" \"${subject}\" for user.`);
        }
    }
}
