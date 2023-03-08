import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesEntity } from './entities/roles.entity';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersRolesEntity } from './entities/users-roles.entity';
import { defaultRoleValue } from './constants/default-role-value';

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

    public async getDefaultRole() {
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

    public deleteRole(role: RolesEntity): Promise<any> {
        if (!role) {
            throw new NotFoundException('Role not found.');
        }

        return this.pgConnection.rows<any>(
            `
                DELETE
                FROM public.roles AS r
                WHERE r.id = $1::INT;
            `,
            [role.id],
        );
    }

    public async setRoleForUser(role: RolesEntity, user: UsersEntity): Promise<UsersRolesEntity> {
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        if (!role) {
            throw new NotFoundException('Role not found.');
        }

        const insertedRows: UsersRolesEntity[] = await this.pgConnection.rows<UsersRolesEntity>(
            `
                INSERT INTO public.users_roles(user_id, role_id)
                VALUES ($1::INT, $2::INT)
                RETURNING user_id, role_id;
            `,
            [user.id, role.id],
        );
        const userRoleConnection: UsersRolesEntity = insertedRows[0];

        return userRoleConnection;
    }
}
