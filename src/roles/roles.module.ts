import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';

import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [UsersModule],
    exports: [RolesService],
})
export class RolesModule {}
