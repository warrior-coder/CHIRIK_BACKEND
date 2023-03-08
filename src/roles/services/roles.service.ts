import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { UsersEntity } from 'src/users/entities/users.entity';

import { defaultRoleValue } from '../constants/default-role-value';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RolesEntity } from '../entities/roles.entity';
import { UsersRolesEntity } from '../entities/users-roles.entity';

@Injectable()
export class RolesService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public getAllRoles(): Promise<RolesEntity[]> {
        return this.pgConnection.rows<RolesEntity>(`
            SELECT r.*
            FROM public.roles AS r;
        `);
    }

    public async getRoleById(roleId: number): Promise<RolesEntity | null> {
        const queryResultRows = await this.pgConnection.rows<RolesEntity>(
            `
                SELECT r.*
                FROM public.roles AS r
                WHERE r.id = $1::INT
            `,
            [roleId],
        );
        const role: RolesEntity | undefined = queryResultRows[0];

        if (!role) {
            return null;
        }

        return role;
    }

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

    public async getDefaultRole(): Promise<RolesEntity> {
        const queryResultRows = await this.pgConnection.rows<RolesEntity>(
            `
                SELECT r.*
                FROM public.roles AS r
                WHERE r.value = $1::VARCHAR(16)
            `,
            [defaultRoleValue],
        );
        const role: RolesEntity | undefined = queryResultRows[0];

        if (!role) {
            throw new InternalServerErrorException('Default role not defined');
        }

        return role;
    }

    public async createRole(createRoleDto: CreateRoleDto): Promise<RolesEntity> {
        const insertedRows: RolesEntity[] = await this.pgConnection.rows<RolesEntity>(
            `
                INSERT INTO public.roles("value")
                VALUES ($1::VARCHAR(16))
                RETURNING id, "value";
            `,
            [createRoleDto.value],
        );
        const role: RolesEntity = insertedRows[0];

        return role;
    }

    public deleteRole(roleId: number): Promise<any> {
        return this.pgConnection.rows<any>(
            `
                DELETE
                FROM public.roles AS r
                WHERE r.id = $1::INT;
            `,
            [roleId],
        );
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
}
