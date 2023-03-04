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

import { CreateTweetDto } from '../dto/create-tweet.dto';
import { TweetsService } from '../services/tweets.service';

@UseGuards(AuthGuard)
@Controller('tweets')
export class TweetsController {
    constructor(
        private readonly tweetsService: TweetsService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Post('/restriction/read/:userId')
    public async createRestrictionToReadTweets(
        @Param('userId') targetUserId: string,
        @CurrentUserDecorator() initiatorUser: UsersEntity,
    ) {
        const targetUser = await this.usersService.getUserById(targetUserId);

        return this.tweetsService.createRestrictionToReadTweets(targetUser, initiatorUser);
    }

    @Get('/user/:userId')
    public async getAllUserTweets(
        @Param('userId') userId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const user = await this.usersService.getUserById(userId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToReadTweets(
            currentUser,
            currentUserRoles,
            user,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('read', 'tweets');

        return this.tweetsService.getAllUserTweets(user);
    }

    @Get('/paginate/user/:userId')
    public async getPaginatedAllUserTweets(
        @Param('userId') userId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        const user = await this.usersService.getUserById(userId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToReadTweets(
            currentUser,
            currentUserRoles,
            user,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('read', 'tweets');

        return this.tweetsService.getPaginatedAllUserTweets(user, page, limit);
    }

    @Get('/all')
    public getAllTweets() {
        return this.tweetsService.getAllTweets();
    }

    @Get('/all/paginate')
    public getPaginatedAllTweets(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        return this.tweetsService.getPaginatedAllTweets(page, limit);
    }

    @Post('/')
    @UseInterceptors(FilesInterceptor('imageFiles'))
    public createTweet(
        @Body() createTweetDto: CreateTweetDto,
        @CurrentUserDecorator() author: UsersEntity,
        @UploadedFiles() imageFiles: Array<Express.Multer.File>,
    ) {
        return this.tweetsService.createTweet(createTweetDto, author, imageFiles);
    }

    @Get('/:tweetId')
    public async getTweetById(
        @Param('tweetId') tweetId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const tweet = await this.tweetsService.getTweetByIdOrThrow(tweetId);
        const currentUserAbility = await this.caslAbilityFactory.defineAbilityToReadTweets(
            currentUser,
            currentUserRoles,
            tweet.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('read', 'tweets');

        return tweet;
    }

    @Delete('/:tweetId')
    public async deleteTweetById(
        @Param('tweetId') tweetId: string,
        @CurrentUserDecorator() currentUser: UsersEntity,
        @CurrentUserRolesDecorator() currentUserRoles: string[],
    ) {
        const tweet = await this.tweetsService.getTweetByIdOrThrow(tweetId);
        const currentUserAbility = this.caslAbilityFactory.defineAbilityToDeleteTweets(
            currentUser,
            currentUserRoles,
            tweet.author,
        );

        ForbiddenError.from(currentUserAbility).throwUnlessCan('delete', 'tweets');

        return this.tweetsService.deleteTweet(tweet);
    }
}
