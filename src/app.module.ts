import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfig } from 'configs/typeorm-config';

import { ServeStaticConfig } from '../configs/serve-static-config';

import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { FilesModule } from './files/files.module';
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
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
        ServeStaticModule.forRootAsync({ useClass: ServeStaticConfig }),
        UsersModule,
        AuthModule,
        RecordsModule,
        FilesModule,
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UsersController, CommentsController, RecordsController);
    }
}
