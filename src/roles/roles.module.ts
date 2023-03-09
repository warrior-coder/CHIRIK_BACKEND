import { Module } from '@nestjs/common';
import { NestPgModule } from 'nest-pg';

import { NestPgConfig } from 'configs/nest-pg.config';

import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [NestPgModule.registerAsync({ useClass: NestPgConfig })],
    exports: [RolesService],
})
export class RolesModule {}
