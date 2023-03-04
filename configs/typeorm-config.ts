import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { dataSourceOptions } from './data-source';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            ...dataSourceOptions,
        };
    }
}
