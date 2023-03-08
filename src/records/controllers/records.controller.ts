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
import { UsersService } from 'src/users/services/users.service';

import { CreateRecordDto } from '../dto/create-record.dto';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('/records')
export class RecordsController {
    constructor(private readonly usersService: UsersService, private readonly recordsService: RecordsService) {}

    @Get('/user/:userId')
    public async getAllUserRecords(@Param('userId', ParseIntPipe) userId: number) {
        const user = await this.usersService.getUserById(userId);

        return this.recordsService.getAllUserRecords(user);
    }

    @Get('/all')
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
    public async deleteRecordById(@Param('recordId', ParseIntPipe) recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.deleteRecord(record);
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
