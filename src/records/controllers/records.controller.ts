import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '@app/auth';
import { CurrentUserDecorator } from 'src/auth/decorators/current-user.decorator';
import { UsersEntity } from 'src/users/entities/users.entity';
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
        @CurrentUserDecorator() author: UsersEntity,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        return this.recordsService.createRecord(createRecordDto, author, imageFiles);
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
    public async createLikeOnRecord(
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.createLikeOnRecord(record, currentUser);
    }

    @Delete('/:recordId/like')
    public async deleteLikeFromRecord(
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.deleteLikeFromRecord(record, currentUser);
    }

    @Get('/:recordId/likes-count')
    public async getRecordLikesCount(@Param('recordId') recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.getRecordLikesCount(record);
    }

    @Get('/:recordId/is-like-exists')
    public async getIsLikeOnRecordExists(
        @Param('recordId') recordId: number,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.recordsService.getIsLikeOnRecordExists(record, currentUser);
    }
}
