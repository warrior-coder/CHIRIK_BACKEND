import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { LikesCount } from 'src/interfaces/likes-count.interface';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateRecordDto } from '../dto/create-record.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordLikesEntity } from '../entities/record-likes.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
        @InjectRepository(RecordLikesEntity) private readonly recordLikesRepository: Repository<RecordLikesEntity>,
    ) {}

    public getAllUserRecords(user: UsersEntity): Promise<RecordsEntity[]> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.recordsRepository
            .createQueryBuilder('records')
            .leftJoinAndSelect('records.images', 'images')
            .leftJoinAndSelect('records.author', 'author')
            .where(`records."isComment" = FALSE AND records."authorId" = :userId`, { userId: user.id })
            .orderBy('records.createdAt', 'DESC')
            .getMany();
    }

    public getAllRecords() {
        return this.recordsRepository.find({
            relations: {
                images: true,
                author: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    public async createRecord(
        createRecordDto: CreateRecordDto,
        author: UsersEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!createRecordDto.text && imageFiles.length === 0) {
            throw new BadRequestException('record cannot be empty');
        }

        const tweet: RecordsEntity = this.recordsRepository.create({
            text: createRecordDto.text,
            author,
        });

        await this.recordsRepository.save(tweet);

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

    public async deleteRecord(tweet: RecordsEntity): Promise<RecordsEntity> {
        if (!tweet) {
            throw new NotFoundException('tweet not found');
        }

        const tweetImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :recordId`, { recordId: tweet.id })
            .getMany();

        tweetImages.forEach(async (tweetImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(tweetImage.name);
            await this.recordImagesRepository.remove(tweetImage);
        });

        return this.recordsRepository.remove(tweet);
    }

    public getRecordById(recordId: number): Promise<RecordsEntity | null> {
        return this.recordsRepository.findOne({
            where: {
                id: recordId,
            },
            relations: {
                author: true,
                images: true,
            },
        });
    }

    public getRecordByIdOrThrow(recordId: number): Promise<RecordsEntity> {
        const record = this.recordsRepository.findOne({
            where: {
                id: recordId,
            },
            relations: {
                author: true,
                images: true,
            },
        });

        if (!record) {
            throw new NotFoundException('record not found');
        }

        return record;
    }

    public createLikeOnRecord(record: RecordsEntity, user: UsersEntity): Promise<RecordLikesEntity> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        const likeOnRecord = this.recordLikesRepository.create({
            record,
            user,
        });

        return this.recordLikesRepository.save(likeOnRecord);
    }

    public deleteLikeFromRecord(record: RecordsEntity, user: UsersEntity): Promise<DeleteResult> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        return this.recordLikesRepository.delete({
            record,
            user,
        });
    }

    public async getRecordLikesCount(record: RecordsEntity): Promise<LikesCount> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        const likesCount = await this.recordLikesRepository.count({
            where: {
                record,
            },
        });

        return {
            likesCount,
        };
    }
}
