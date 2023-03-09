import { Module } from '@nestjs/common';

import { RolesModule } from 'src/roles/roles.module';

import { RestrictionsController } from './controllers/restrictions.controller';
import { RestrictionsService } from './services/restrictions.service';

@Module({
    controllers: [RestrictionsController],
    providers: [RestrictionsService],
    imports: [RolesModule],
    exports: [RestrictionsService],
})
export class RestrictionsModule {}
