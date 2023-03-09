import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { RolesEntity } from '../entities/roles.entity';
import { UsersRolesEntity } from '../entities/users-roles.entity';

@Injectable()
export class RolesService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public getUserRoles(userId: number): Promise<RolesEntity[]> {
        return this.pgConnection.rows<RolesEntity>(
            `
                SELECT r.*
                FROM public.roles AS r
                INNER JOIN public.users_roles AS ur ON r.id = ur.role_id
                WHERE ur.user_id = $1::INT;
            `,
            [userId],
        );
    }

    public async getRoleByValue(roleValue: string): Promise<RolesEntity | null> {
        const queryResultRows = await this.pgConnection.rows<RolesEntity>(
            `
                SELECT r.*
                FROM public.roles AS r
                WHERE r.value = $1::VARCHAR(16)
            `,
            [roleValue],
        );
        const role: RolesEntity | undefined = queryResultRows[0];

        if (!role) {
            return null;
        }

        return role;
    }

    public async setRoleForUser(roleId: number, userId: number): Promise<UsersRolesEntity> {
        const insertedRows: UsersRolesEntity[] = await this.pgConnection.rows<UsersRolesEntity>(
            `
                INSERT INTO public.users_roles(user_id, role_id)
                VALUES ($1::INT, $2::INT)
                RETURNING user_id, role_id;
            `,
            [userId, roleId],
        );
        const userRoleConnection: UsersRolesEntity = insertedRows[0];

        return userRoleConnection;
    }

    public async isUserHasRoleByValue(userId: number, roleValue: string): Promise<boolean> {
        const existsRows: boolean[] = await this.pgConnection.rows<boolean>(
            `
                SELECT EXISTS(
                    SELECT ur.*
                    FROM public.users_roles AS ur
                    INNER JOIN roles AS r ON r.id = ur.role_id
                    WHERE ur.user_id = $1 AND r."value" = $2::VARCHAR(16)
                ) is_user_has_role_value;
            `,
            [userId, roleValue],
        );
        const isUserHasRoleValue = Boolean(existsRows[0]['is_user_has_role_value']);

        return isUserHasRoleValue;
    }
}
