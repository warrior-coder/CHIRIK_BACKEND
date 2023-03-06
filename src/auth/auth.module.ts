import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisConfig } from 'configs/redis-config';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './controllers/auth.controller';
import { RefreshTokensEntity } from './entities/refresh-tokens.entity';
import { UsersRolesEntity } from './entities/users-roles.entity';
import { AuthService } from './services/auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([RefreshTokensEntity, UsersEntity, UsersRolesEntity]),
        MailerModule,
        RedisModule.forRootAsync({ useClass: RedisConfig }),
    ],
})
export class AuthModule {}
