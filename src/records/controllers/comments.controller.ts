import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from '../services/comments.service';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private readonly recordsService: RecordsService, private readonly commentsService: CommentsService) {}

    @Post('/record/:recordId')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createCommentOnRecord(
        @Body() createCommentDto: CreateCommentDto,
        @Param('recordId', ParseIntPipe) recordId: number,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordByIdOrThrow(recordId);

        return this.commentsService.createCommentOnRecord(createCommentDto, currentUser, record, imageFiles);
    }

    @Get('/count/record/:recordId')
    public async getRecordCommentsCount(@Param('recordId', ParseIntPipe) recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getRecordCommentsCount(record);
    }

    @Get('/:commentId')
    public async getCommentById(@Param('commentId', ParseIntPipe) commentId: number) {
        const comment = await this.commentsService.getCommentByIdOrThrow(commentId);

        return comment;
    }

    @Get('/upper-lever/paginate/record/:recordId')
    public async getUpperLevelCommentsOfRecord(@Param('recordId', ParseIntPipe) recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getUpperLevelCommentsOfRecord(record);
    }

    @Delete('/:commentId')
    public async deleteCommentById(@Param('commentId', ParseIntPipe) commentId: number) {
        const comment = await this.commentsService.getCommentById(commentId);

        return this.commentsService.clearCommentAndMarkAsDeleted(comment);
    }
}
