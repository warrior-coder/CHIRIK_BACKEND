import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { MailerConfig } from 'configs/mailer.config';
import { RedisConfig } from 'configs/redis.config';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        MailerModule.forRootAsync({ useClass: MailerConfig }),
        RedisModule.forRootAsync({ useClass: RedisConfig }),
        RolesModule,
    ],
    exports: [],
})
export class AuthModule {}
