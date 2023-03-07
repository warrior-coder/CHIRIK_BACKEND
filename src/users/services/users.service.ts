import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}

    public getAllUsers(): Promise<UsersEntity[]> {
        return this.usersRepository.query(`
            SELECT u.*
            FROM users AS u;
        `);
    }

    public async getUserById(userId: number): Promise<UsersEntity | null> {
        const selectedRows: UsersEntity[] = await this.usersRepository.query(
            `
                SELECT u.*
                FROM users AS u
                WHERE u.id = $1::INT
                LIMIT 1;
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
        const selectedRows: UsersEntity[] = await this.usersRepository.query(
            `
                SELECT u.*
                FROM users AS u
                WHERE u.email = $1::VARCHAR(32)
                LIMIT 1;
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
        const insertedRows: UsersEntity[] = await this.usersRepository.query(
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

    public deleteUser(user: UsersEntity): Promise<DeleteResult> {
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return this.usersRepository.query(
            `
                DELETE
                FROM users AS u
                WHERE u.id = $1::INT;
            `,
            [user.id],
        );
    }
}
