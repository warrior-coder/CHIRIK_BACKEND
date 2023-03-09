import { Module } from '@nestjs/common';
import { NestPgModule } from 'nest-pg';

import { NestPgConfig } from 'configs/nest-pg.config';
import { RolesModule } from 'src/roles/roles.module';

import { RestrictionsController } from './controllers/restrictions.controller';
import { RestrictionsService } from './services/restrictions.service';

@Module({
    controllers: [RestrictionsController],
    providers: [RestrictionsService],
    imports: [RolesModule, NestPgModule.registerAsync({ useClass: NestPgConfig })],
    exports: [RestrictionsService],
})
export class RestrictionsModule {}
