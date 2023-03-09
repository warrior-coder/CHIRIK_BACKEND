import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '@app/auth';
import { CurrentUserIdDecorator } from 'src/auth/decorators/current-user.decorator';
import { Actions } from 'src/restrictions/enums/actions.enum';
import { Subjects } from 'src/restrictions/enums/subjects.enum';
import { RestrictionsService } from 'src/restrictions/services/restrictions.service';

import { CreateRecordDto } from '../dto/create-record.dto';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('/records')
export class RecordsController {
    constructor(
        private readonly recordsService: RecordsService,
        private readonly restrictionsService: RestrictionsService,
    ) {}

    @Get('/user/:userId')
    public async getAllUserRecords(
        @Param('userId', ParseIntPipe) userId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        await this.restrictionsService.throwForbiddenExceptionIfRestricted(
            Actions.READ,
            Subjects.RECORDS,
            userId,
            currentUserId,
        );

        return this.recordsService.getAllUserRecords(userId);
    }

    @Get('/')
    public getAllRecords() {
        return this.recordsService.getAllRecords();
    }

    @Post('/')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public createRecord(
        @Body() createRecordDto: CreateRecordDto,
        @CurrentUserIdDecorator() currentUserId: number,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        return this.recordsService.createRecord(createRecordDto, currentUserId, imageFiles);
    }

    @Patch('/:recordId')
    public async editRecordById(@Param('recordId', ParseIntPipe) recordId: number, @Body() editRecordDto: any) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.editRecord(record, editRecordDto);
    }

    @Delete('/:recordId')
    public deleteRecordById(@Param('recordId', ParseIntPipe) recordId: number) {
        return this.recordsService.deleteRecord(recordId);
    }

    @Get('/:recordId')
    public getRecordById(@Param('recordId', ParseIntPipe) recordId: number) {
        return this.recordsService.getRecordById(recordId);
    }

    @Post('/:recordId/like')
    public createLikeOnRecord(
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.recordsService.createLikeOnRecord(recordId, currentUserId);
    }

    @Delete('/:recordId/like')
    public deleteLikeFromRecord(
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.recordsService.deleteLikeFromRecord(recordId, currentUserId);
    }

    @Get('/:recordId/likes-count')
    public getRecordLikesCount(@Param('recordId') recordId: number) {
        return this.recordsService.getRecordLikesCount(recordId);
    }

    @Get('/:recordId/is-like-exists')
    public getIsLikeOnRecordExists(
        @Param('recordId') recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.recordsService.getIsLikeOnRecordExists(recordId, currentUserId);
    }
}
