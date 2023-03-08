import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [UsersModule],
})
export class RolesModule {}
