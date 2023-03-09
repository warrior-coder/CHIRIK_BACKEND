import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ServeStaticConfig } from '../configs/serve-static.config';

import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { CommentsController } from './records/controllers/comments.controller';
import { LikesController } from './records/controllers/likes.controller';
import { RecordsController } from './records/controllers/records.controller';
import { RecordsModule } from './records/records.module';
import { RestrictionsController } from './restrictions/controllers/restrictions.controller';
import { RestrictionsModule } from './restrictions/restrictions.module';
import { RolesModule } from './roles/roles.module';
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
        ServeStaticModule.forRootAsync({ useClass: ServeStaticConfig }),
        UsersModule,
        AuthModule,
        RecordsModule,
        RolesModule,
        RestrictionsModule,
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(UsersController, CommentsController, RecordsController, RestrictionsController, LikesController);
    }
}
