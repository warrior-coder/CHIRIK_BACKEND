import { ForbiddenException, Injectable } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { RolesService } from 'src/roles/services/roles.service';

import { UserRestrictionsEntity } from '../entities/user-restrictions.entity';

@Injectable()
export class RestrictionsService {
    constructor(
        @PgConnection() private readonly pgConnection: NestPgPool,
        private readonly rolesService: RolesService,
    ) {}

    public async createRestrictionForUser(
        action: string,
        subject: string,
        initiatorUserId: number,
        restrictedUserId: number,
    ): Promise<UserRestrictionsEntity> {
        const insertedRows: UserRestrictionsEntity[] = await this.pgConnection.rows<UserRestrictionsEntity>(
            `
                INSERT INTO public.user_restrictions("action", "subject", user_id, restricted_user_id)
                VALUES ($1::VARCHAR(16), $2::VARCHAR(16), $3::INT, $4::INT)
                RETURNING id, "action", "subject", user_id, restricted_user_id;
            `,
            [action, subject, initiatorUserId, restrictedUserId],
        );
        const userRestriction: UserRestrictionsEntity = insertedRows[0];

        return userRestriction;
    }

    public async throwForbiddenExceptionIfRestricted(
        action: string,
        subject: string,
        initiatorUserId: number,
        restrictedUserId: number,
    ): Promise<void> {
        const isUserAdmin = await this.rolesService.isUserHasRoleByValue(restrictedUserId, 'admin');

        if (isUserAdmin) {
            return;
        }

        const existRestrictionRows: boolean[] = await this.pgConnection.rows<boolean>(
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
            [action, subject, initiatorUserId, restrictedUserId],
        );
        const isRestricted = Boolean(existRestrictionRows[0]['is_restricted']);

        if (isRestricted) {
            throw new ForbiddenException(`Forbidden to \"${action}\" \"${subject}\" for user.`);
        }
    }
}
