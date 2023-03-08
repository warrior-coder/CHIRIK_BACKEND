import { Injectable, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesEntity } from './entities/roles.entity';

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

    public async createRole(createRoleDto: CreateRoleDto): Promise<RolesEntity> {
        const insertedRows: RolesEntity[] = await this.pgConnection.rows<RolesEntity>(
            `
                INSERT INTO roles("value")
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
                FROM roles AS r
                WHERE r.id = $1::INT;
            `,
            [role.id],
        );
    }
}
