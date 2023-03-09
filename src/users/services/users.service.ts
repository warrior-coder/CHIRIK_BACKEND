import { Injectable, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { CreateUserDto } from '../dto/create-user.dto';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public getAllUsers(): Promise<UsersEntity[]> {
        return this.pgConnection.rows<UsersEntity>(`
            SELECT u.*
            FROM users AS u;
        `);
    }

    public async getUser(userId: number): Promise<UsersEntity | null> {
        const selectedRows: UsersEntity[] = await this.pgConnection.rows<UsersEntity>(
            `
                SELECT u.*
                FROM users AS u
                WHERE u.id = $1::INT;
            `,
            [userId],
        );
        const user: UsersEntity | undefined = selectedRows[0];

        if (!user) {
            return null;
        }

        return user;
    }

    public async getUserByEmail(userEmail: string): Promise<UsersEntity | null> {
        const selectedRows: UsersEntity[] = await this.pgConnection.rows<UsersEntity>(
            `
                SELECT u.*
                FROM users AS u
                WHERE u.email = $1::VARCHAR(32);
            `,
            [userEmail],
        );
        const user: UsersEntity | undefined = selectedRows[0];

        if (!user) {
            return null;
        }

        return user;
    }

    public async createUser(createUserDto: CreateUserDto): Promise<UsersEntity> {
        const insertedRows: UsersEntity[] = await this.pgConnection.rows<UsersEntity>(
            `
                INSERT INTO users("name", email, "password")
                VALUES ($1::VARCHAR(32), $2::VARCHAR(64), $3::VARCHAR(128))
                RETURNING id, "name", email, "password";
            `,
            [createUserDto.name, createUserDto.email, createUserDto.password],
        );
        const user: UsersEntity = insertedRows[0];

        return user;
    }

    public deleteUser(user: UsersEntity): Promise<any> {
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return this.pgConnection.rows<any>(
            `
                DELETE
                FROM users AS u
                WHERE u.id = $1::INT;
            `,
            [user.id],
        );
    }
}
