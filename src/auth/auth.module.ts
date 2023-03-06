import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerConfig } from 'configs/mailer-config';
import { RedisConfig } from 'configs/redis-config';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([UsersEntity]),
        MailerModule.forRootAsync({ useClass: MailerConfig }),
        RedisModule.forRootAsync({ useClass: RedisConfig }),
    ],
})
export class AuthModule {}
