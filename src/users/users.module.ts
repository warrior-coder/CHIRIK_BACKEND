import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RestrictionsModule } from 'src/restrictions/restrictions.module';

import { UsersController } from './controllers/users.controller';
import { UserProfileImagesEntity } from './entities/users-profile-images.entity';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, UserProfileImagesEntity]), RestrictionsModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
