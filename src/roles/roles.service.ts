import { Injectable } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { RolesEntity } from 'src/users/entities/roles.entity';

@Injectable()
export class RolesService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public getAllRoles(): Promise<RolesEntity[]> {
        return this.pgConnection.rows<RolesEntity>(`
            SELECT r.*
            FROM public.roles AS r;
        `);
    }
}
