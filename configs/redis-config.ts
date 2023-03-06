import { RedisModuleOptions, RedisModuleOptionsFactory } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfig implements RedisModuleOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createRedisModuleOptions(): RedisModuleOptions {
        return {
            config: {
                url: this.configService.get<string>('REDIS_URL'),
            },
        };
    }
}
