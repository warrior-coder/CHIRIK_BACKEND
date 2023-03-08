import { Module } from '@nestjs/common';

import { RestrictionsController } from './controllers/restrictions.controller';
import { RestrictionsService } from './services/restrictions.service';

@Module({
    controllers: [RestrictionsController],
    providers: [RestrictionsService],
    exports: [RestrictionsService],
})
export class RestrictionsModule {}
