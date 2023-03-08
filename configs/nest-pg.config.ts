import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestPgOptions, NestPgOptionsFactory } from 'nest-pg';

@Injectable()
export class NestPgConfig implements NestPgOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createNestPgOptions(): NestPgOptions {
        return {
            host: this.configService.get<string>('TYPEORM_HOST'),
            port: this.configService.get<number>('TYPEORM_PORT'),
            user: this.configService.get<string>('TYPEORM_USERNAME'),
            password: this.configService.get<string>('TYPEORM_PASSWORD'),
            database: this.configService.get<string>('TYPEORM_DATABASE'),
        };
    }
}
