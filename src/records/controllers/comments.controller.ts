import { ForbiddenError } from '@casl/ability';
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

import { CurrentUserRolesDecorator } from 'src/decorators/current-user-roles.decorator';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CaslAbilityFactory } from 'src/restrictions/casl-ability.factory';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from '../services/comments.service';
import { RecordsService } from '../services/records.service';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(
        private readonly recordsService: RecordsService,
        private readonly commentsService: CommentsService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Post('/restriction/create/:userId')
    public async createRestrictionToCreateComments(
        @Param('userId') targetUserId: string,
        @CurrentUserDecorator() initiatorUser: UsersEntity,
    ) {
        const targetUser = await this.usersService.getUserById(targetUserId);

        return this.commentsService.createRestrictionToCreateComments(targetUser, initiatorUser);
    }

    @Post('/restriction/read/:userId')
    public async createRestrictionToReadComments(
        @Param('userId') targetUserId: string,
        @CurrentUserDecorator() initiatorUser: UsersEntity,
    ) {
        const targetUser = await this.usersService.getUserById(targetUserId);

        return this.commentsService.createRestrictionToReadComments(targetUser, initiatorUser);
    }

    @Post('/record/:recordId')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public async createCommentOnRecord(
        @Body() createCommentDto: CreateCommentDto,
        @Param('recordId') recordId: string,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const record = await this.recordsService.getRecordByIdOrThrow(recordId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToCreateComments(
            currentUser,
            currentUserRoles,
            record.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('create', 'comments');

        return this.commentsService.createCommentOnRecord(createCommentDto, currentUser, record, imageFiles);
    }

    @Get('/count/record/:recordId')
    public async getRecordCommentsCount(@Param('recordId') recordId: string) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getRecordCommentsCount(record);
    }

    @Get('/:commentId')
    public async getCommentById(
        @Param('commentId') commentId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const comment = await this.commentsService.getCommentByIdOrThrow(commentId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToReadComments(
            currentUser,
            currentUserRoles,
            comment.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('read', 'comments');

        return comment;
    }

    @Get('/tree/record/:recordId')
    public async getRecordCommentsTree(
        @Param('recordId') recordId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const record = await this.recordsService.getRecordByIdOrThrow(recordId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToReadComments(
            currentUser,
            currentUserRoles,
            record.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('read', 'comments');

        return this.commentsService.getRecordCommentsTree(record);
    }

    @Get('/upper-lever/record/:recordId')
    public async getUpperLevelCommentsOfRecord(@Param('recordId') recordId: string) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getUpperLevelCommentsOfRecord(record);
    }

    @Get('/upper-lever/paginate/record/:recordId')
    public async getPaginatedUpperLevelCommentsOfRecord(
        @Param('recordId') recordId: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        const record = await this.recordsService.getRecordById(recordId);

        return this.commentsService.getPaginatedUpperLevelCommentsOfRecord(record, page, limit);
    }

    @Delete('/:commentId')
    public async deleteCommentById(
        @Param('commentId') commentId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const comment = await this.commentsService.getCommentByIdOrThrow(commentId);
        const currentUserAbility = this.caslAbilityFactory.defineAbilityToDeleteComments(
            currentUser,
            currentUserRoles,
            comment.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('delete', 'comments');

        return this.commentsService.clearCommentAndMarkAsDeleted(comment);
    }
}
