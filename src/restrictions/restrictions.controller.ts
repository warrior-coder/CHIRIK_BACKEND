import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserIdDecorator } from 'src/auth/decorators/current-user.decorator';

import { UserRestrictionsEntity } from './entities/user-restrictions.entity';
import { RestrictionsService } from './restrictions.service';

@UseGuards(AuthGuard)
@Controller('/restrictions')
export class RestrictionsController {
    constructor(private readonly restrictionsService: RestrictionsService) {}

    @Post('/read/records/user/:restrictedUserId')
    public createRestrictionToReadRecordsForUser(
        @Param('restrictedUserId', ParseIntPipe) restrictedUserId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ): Promise<UserRestrictionsEntity> {
        return this.restrictionsService.createRestrictionToReadRecordsForUser(
            'read',
            'records',
            currentUserId,
            restrictedUserId,
        );
    }
}
