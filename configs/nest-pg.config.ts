import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestPgOptions, NestPgOptionsFactory } from 'nest-pg';

@Injectable()
export class NestPgConfig implements NestPgOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createNestPgOptions(): NestPgOptions {
        return {
            host: this.configService.get<string>('POSTGRES_HOST'),
            port: this.configService.get<number>('POSTGRES_PORT'),
            user: this.configService.get<string>('POSTGRES_USER'),
            password: this.configService.get<string>('POSTGRES_PASSWORD'),
            database: this.configService.get<string>('POSTGRES_DATABASE'),
        };
    }
}
