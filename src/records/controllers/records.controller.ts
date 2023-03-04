import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
    constructor(private readonly recordsService: RecordsService) {}

    @Get('/:recordId')
    public getRecordById(@Param('recordId') recordId: string) {
        return this.recordsService.getRecordById(recordId);
    }

    @Post('/:recordId/like')
    public async createLikeOnRecord(
        @Param('recordId') recordId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.createLikeOnRecord(record, currentUser);
    }

    @Delete('/:recordId/like')
    public async deleteLikeFromRecord(
        @Param('recordId') recordId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.deleteLikeFromRecord(record, currentUser);
    }

    @Get('/:recordId/likes-count')
    public async getRecordLikesCount(@Param('recordId') recordId: string) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.getRecordLikesCount(record);
    }
}
