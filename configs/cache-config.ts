import { CacheModuleOptions, CacheOptionsFactory, CacheStore, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createCacheOptions(): CacheModuleOptions {
        return {
            store: redisStore as unknown as CacheStore,
            port: this.configService.get<number>('REDIS_PORT'),
        };
    }
}
