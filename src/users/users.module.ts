import { Module } from '@nestjs/common';
import { NestPgModule } from 'nest-pg';

import { NestPgConfig } from 'configs/nest-pg.config';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [NestPgModule.registerAsync({ useClass: NestPgConfig })],
    exports: [UsersService],
})
export class UsersModule {}
