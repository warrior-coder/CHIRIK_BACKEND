import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestPgModule } from 'nest-pg';

import { NestPgConfig } from 'configs/nest-pg.config';
import { TypeOrmConfig } from 'configs/typeorm-config';

import { ServeStaticConfig } from '../configs/serve-static-config';

import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { CommentsController } from './records/controllers/comments.controller';
import { RecordsController } from './records/controllers/records.controller';
import { RecordsModule } from './records/records.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersModule } from './users/users.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        NestPgModule.registerAsync({ useClass: NestPgConfig }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
        ServeStaticModule.forRootAsync({ useClass: ServeStaticConfig }),
        UsersModule,
        AuthModule,
        RecordsModule,
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController, CommentsController, RecordsController);
    }
}
