import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslAbilityFactory } from './casl-ability.factory';
import { RestrictionsController } from './restrictions.controller';
import { RestrictionsEntity } from './restrictions.entity';
import { RestrictionsService } from './restrictions.service';

@Module({
    imports: [TypeOrmModule.forFeature([RestrictionsEntity])],
    providers: [CaslAbilityFactory, RestrictionsService],
    exports: [CaslAbilityFactory],
    controllers: [RestrictionsController],
})
export class RestrictionsModule {}
