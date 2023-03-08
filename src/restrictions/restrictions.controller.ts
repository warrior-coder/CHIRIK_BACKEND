import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserDecorator } from 'src/auth/decorators/current-user.decorator';
import { UsersEntity } from 'src/users/entities/users.entity';

import { UserRestrictionsEntity } from './entities/user-restrictions.entity';
import { RestrictionsService } from './restrictions.service';

@UseGuards(AuthGuard)
@Controller('/restrictions')
export class RestrictionsController {
    constructor(private readonly restrictionsService: RestrictionsService) {}

    @Post('/read/records/user/:restrictedUserId')
    public createRestrictionToReadRecordsForUser(
        @Param('restrictedUserId', ParseIntPipe) restrictedUserId: number,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ): Promise<UserRestrictionsEntity> {
        return this.restrictionsService.createRestrictionToReadRecordsForUser(
            'read',
            'records',
            currentUser.id,
            restrictedUserId,
        );
    }
}
