import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserIdDecorator } from 'src/auth/decorators/current-user.decorator';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { EditCommentDto } from '../dto/edit-comment.dto';
import { CommentsService } from '../services/comments.service';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('/comments')
export class CommentsController {
    constructor(private readonly recordsService: RecordsService, private readonly commentsService: CommentsService) {}

    @Post('/record/:recordId')
    public createCommentOnRecord(
        @Body() createCommentDto: CreateCommentDto,
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.commentsService.createCommentOnRecord(createCommentDto, currentUserId, recordId);
    }

    @Put('/:commentId')
    public async editCommentById(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() editCommentDto: EditCommentDto,
    ) {
        const comment = await this.commentsService.getCommentById(commentId);

        return this.commentsService.editComment(comment, editCommentDto);
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
