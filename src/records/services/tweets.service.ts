import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { RestrictionsEntity } from 'src/restrictions/restrictions.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateTweetDto } from '../dto/create-tweet.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class TweetsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public createRestrictionToReadTweets(
        targetUser: UsersEntity,
        initiatorUser: UsersEntity,
    ): Promise<RestrictionsEntity> {
        if (targetUser.id === initiatorUser.id) {
            throw new BadRequestException('user cannot restrict himself');
        }

        const restriction = this.restrictionsRepository.create({
            targetUser,
            initiatorUser,
            action: 'read',
            subject: 'tweets',
        });

        return this.restrictionsRepository.save(restriction);
    }

    public getAllUserTweets(user: UsersEntity): Promise<RecordsEntity[]> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.recordsTreeRepository
            .createQueryBuilder('records')
            .leftJoinAndSelect('records.images', 'images')
            .leftJoinAndSelect('records.author', 'author')
            .where(`records."isComment" = FALSE AND records."authorId" = :userId`, { userId: user.id })
            .orderBy('records.createdAt', 'DESC')
            .getMany();
    }

    public getPaginatedAllUserTweets(user: UsersEntity, page: number, limit: number): Promise<RecordsEntity[]> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.recordsTreeRepository
            .createQueryBuilder('records')
            .leftJoinAndSelect('records.images', 'images')
            .leftJoinAndSelect('records.author', 'author')
            .where(`records."isComment" = FALSE AND records."authorId" = :userId`, { userId: user.id })
            .orderBy('records.createdAt', 'DESC')
            .skip(page * limit)
            .take(limit)
            .getMany();
    }

    public getAllTweets(): Promise<RecordsEntity[]> {
        return this.recordsTreeRepository.find({
            where: {
                isComment: false,
            },
            relations: {
                images: true,
                author: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    public getPaginatedAllTweets(page: number, limit: number) {
        return this.recordsTreeRepository.find({
            where: {
                isComment: false,
            },
            relations: {
                images: true,
                author: true,
            },
            order: {
                createdAt: 'DESC',
            },
            skip: page * limit,
            take: limit,
        });
    }

    public getTweetById(tweetId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: tweetId,
                isRetweet: false,
                isComment: false,
            },
            relations: {
                images: true,
                author: true,
            },
        });
    }

    public async getTweetByIdOrThrow(tweetId: string): Promise<RecordsEntity> {
        const tweet = await this.recordsTreeRepository.findOne({
            where: {
                id: tweetId,
                isRetweet: false,
                isComment: false,
            },
            relations: {
                images: true,
                author: true,
            },
        });

        if (!tweet) {
            throw new NotFoundException('tweet not found');
        }

        return tweet;
    }

    public async createTweet(
        createTweetDto: CreateTweetDto,
        author: UsersEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!createTweetDto.text && imageFiles.length === 0) {
            throw new BadRequestException('tweet cannot be empty');
        }

        const tweet: RecordsEntity = this.recordsTreeRepository.create({
            text: createTweetDto.text,
            isComment: false,
            isRetweet: false,
            author,
        });

        await this.recordsTreeRepository.save(tweet);

        tweet.images = await Promise.all(
            imageFiles.map(async (imageFile): Promise<RecordImagesEntity> => {
                const fileName = await this.filesService.writeImageFile(imageFile);
                const image = this.recordImagesRepository.create({
                    name: fileName,
                    record: tweet,
                });

                await this.recordImagesRepository.save(image);

                image.record = undefined;

                return image;
            }),
        );

        return tweet;
    }

    public async deleteTweet(tweet: RecordsEntity): Promise<RecordsEntity> {
        if (!tweet) {
            throw new NotFoundException('tweet not found');
        }

        const tweetImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :tweetId`, { tweetId: tweet.id })
            .getMany();

        tweetImages.forEach(async (tweetImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(tweetImage.name);
            await this.recordImagesRepository.remove(tweetImage);
        });

        return this.recordsTreeRepository.remove(tweet);
    }
}
