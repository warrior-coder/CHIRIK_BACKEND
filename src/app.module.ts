import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheConfig } from 'configs/cache-config';
import { TypeOrmConfig } from 'configs/typeorm-config';

import { JwtConfig } from '../configs/jwt-config';
import { MailerConfig } from '../configs/mailer-config';
import { ServeStaticConfig } from '../configs/serve-static-config';

import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
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
        MailerModule.forRootAsync({ useClass: MailerConfig }),
        ServeStaticModule.forRootAsync({ useClass: ServeStaticConfig }),
        JwtModule.registerAsync({ useClass: JwtConfig }),
        CacheModule.registerAsync({ useClass: CacheConfig }),
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
