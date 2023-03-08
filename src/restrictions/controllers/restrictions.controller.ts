import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserIdDecorator } from 'src/auth/decorators/current-user.decorator';

import { UserRestrictionsEntity } from '../entities/user-restrictions.entity';
import { Actions } from '../enums/actions.enum';
import { Subjects } from '../enums/subjects.enum';
import { RestrictionsService } from '../services/restrictions.service';

@UseGuards(AuthGuard)
@Controller('/restrictions')
export class RestrictionsController {
    constructor(private readonly restrictionsService: RestrictionsService) {}

    @Post('/read/records/user/:restrictedUserId')
    public createRestrictionToReadRecordsForUser(
        @Param('restrictedUserId', ParseIntPipe) restrictedUserId: number,
        @CurrentUserIdDecorator() initiatorUserId: number,
    ): Promise<any> {
        return this.restrictionsService.createRestrictionForUser(
            Actions.READ,
            Subjects.RECORDS,
            initiatorUserId,
            restrictedUserId,
        );
    }

    @Post('/read/records/user/:restrictedUserId')
    public createRestrictionToReadCommentsForUser(
        @Param('restrictedUserId', ParseIntPipe) restrictedUserId: number,
        @CurrentUserIdDecorator() initiatorUserId: number,
    ): Promise<UserRestrictionsEntity> {
        return this.restrictionsService.createRestrictionForUser(
            Actions.READ,
            Subjects.COMMENTS,
            initiatorUserId,
            restrictedUserId,
        );
    }
}
