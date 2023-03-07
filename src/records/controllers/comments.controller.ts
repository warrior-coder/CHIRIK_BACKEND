import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from '../services/comments.service';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('/comments')
export class CommentsController {
    constructor(private readonly recordsService: RecordsService, private readonly commentsService: CommentsService) {}

    @Post('/record/:recordId')
    public async createCommentOnRecord(
        @Body() createCommentDto: CreateCommentDto,
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserDecorator() currentUser: UsersEntity,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.createCommentOnRecord(createCommentDto, currentUser, record);
    }

    @Get('/count/record/:recordId')
    public async getRecordCommentsCount(@Param('recordId', ParseIntPipe) recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getRecordCommentsCount(record);
    }

    @Get('/:commentId')
    public async getCommentById(@Param('commentId', ParseIntPipe) commentId: number) {
        const comment = await this.commentsService.getCommentById(commentId);

        return comment;
    }

    @Get('/record/:recordId')
    public async getRecordComments(@Param('recordId', ParseIntPipe) recordId: number) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getRecordComments(record);
    }

    @Delete('/:commentId')
    public async deleteCommentById(@Param('commentId', ParseIntPipe) commentId: number) {
        const comment = await this.commentsService.getCommentById(commentId);

        return this.commentsService.deleteComment(comment);
    }
}
