import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserIdDecorator } from 'src/auth/decorators/current-user.decorator';

import { LikesService } from '../services/likes.service';

@UseGuards(AuthGuard)
@Controller('/likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    @Post('/record/:recordId')
    public createLikeOnRecord(
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.likesService.createLikeOnRecord(recordId, currentUserId);
    }

    @Delete('/record/:recordId')
    public deleteLikeFromRecord(
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.likesService.deleteLikeFromRecord(recordId, currentUserId);
    }

    @Get('/count/record/:recordId')
    public getLikesCountOnRecord(@Param('recordId') recordId: number) {
        return this.likesService.getLikesCountOnRecord(recordId);
    }

    @Get('/:recordId/is-like-exists')
    public getIsLikeOnRecordExists(
        @Param('recordId') recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.likesService.getIsLikeOnRecordExists(recordId, currentUserId);
    }
}
