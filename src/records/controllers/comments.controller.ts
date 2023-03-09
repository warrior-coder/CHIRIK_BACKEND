import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';
import { CurrentUserIdDecorator } from 'src/auth/decorators/current-user.decorator';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { EditCommentDto } from '../dto/edit-comment.dto';
import { CommentsService } from '../services/comments.service';

@UseGuards(AuthGuard)
@Controller('/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post('/record/:recordId')
    public createCommentOnRecord(
        @Body() createCommentDto: CreateCommentDto,
        @Param('recordId', ParseIntPipe) recordId: number,
        @CurrentUserIdDecorator() currentUserId: number,
    ) {
        return this.commentsService.createCommentOnRecord(createCommentDto, currentUserId, recordId);
    }

    @Put('/:commentId')
    public editComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() editCommentDto: EditCommentDto) {
        return this.commentsService.editComment(commentId, editCommentDto);
    }

    @Get('/count/record/:recordId')
    public getRecordCommentsCount(@Param('recordId', ParseIntPipe) recordId: number) {
        return this.commentsService.getRecordCommentsCount(recordId);
    }

    @Get('/:commentId')
    public getComment(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentsService.getComment(commentId);
    }

    @Get('/record/:recordId')
    public getRecordComments(@Param('recordId', ParseIntPipe) recordId: number) {
        return this.commentsService.getRecordComments(recordId);
    }

    @Delete('/:commentId')
    public deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentsService.deleteComment(commentId);
    }
}
