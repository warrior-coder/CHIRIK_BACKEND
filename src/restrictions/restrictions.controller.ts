import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';

import { RestrictionsService } from './restrictions.service';

@UseGuards(AuthGuard)
@Controller('/restrictions')
export class RestrictionsController {
    constructor(private readonly restrictionsService: RestrictionsService) {}

    @Get('/all')
    public getAllUserRestrictions(@CurrentUserDecorator() currentUser: UsersEntity) {
        return this.restrictionsService.getAllUserRestrictions(currentUser);
    }

    @Get('/:restrictionId')
    public getRestrictionById(@Param('restrictionId') restrictionId: string) {
        return this.restrictionsService.getRestrictionById(restrictionId);
    }

    @Delete('/:restrictionId')
    public async deleteRestrictionById(@Param('restrictionId') restrictionId: string) {
        const restriction = await this.restrictionsService.getRestrictionById(restrictionId);

        return this.restrictionsService.deleteRestriction(restriction);
    }
}
