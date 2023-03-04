import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { RestrictionsEntity } from 'src/restrictions/restrictions.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateRetweetDto } from '../dto/create-retweet.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class RetweetsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public createRestrictionToReadRetweets(
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
            subject: 'retweets',
        });

        return this.restrictionsRepository.save(restriction);
    }

    public createRestrictionToCreateRetweets(
        targetUser: UsersEntity,
        initiatorUser: UsersEntity,
    ): Promise<RestrictionsEntity> {
        if (targetUser.id === initiatorUser.id) {
            throw new BadRequestException('user cannot restrict himself');
        }

        const restriction = this.restrictionsRepository.create({
            targetUser,
            initiatorUser,
            action: 'create',
            subject: 'retweets',
        });

        return this.restrictionsRepository.save(restriction);
    }

    public getUserRetweets(user: UsersEntity): Promise<RecordsEntity[]> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.recordsTreeRepository.find({
            where: {
                isComment: false,
                isRetweet: true,
                author: user,
            },
            relations: {
                images: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    public getRetweetById(retweetId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: retweetId,
                isRetweet: true,
                isComment: false,
            },
            relations: {
                author: true,
                images: true,
            },
        });
    }

    public async getRetweetByIdOrThrow(retweetId: string): Promise<RecordsEntity> {
        const retweet = await this.recordsTreeRepository.findOne({
            where: {
                id: retweetId,
                isRetweet: true,
                isComment: false,
            },
            relations: {
                author: true,
                images: true,
            },
        });

        if (!retweet) {
            throw new NotFoundException('retweet not found');
        }

        return retweet;
    }

    public async createRetweetOnRecord(
        createRetweetDto: CreateRetweetDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        const retweet = this.recordsTreeRepository.create({
            text: createRetweetDto.text,
            isComment: false,
            isRetweet: true,
            author,
            parent: record,
        });

        await this.recordsTreeRepository.save(retweet);

        imageFiles.forEach(async (imageFile) => {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const image = this.recordImagesRepository.create({
                name: fileName,
                record: retweet,
            });

            await this.recordImagesRepository.save(image);
        });

        return retweet;
    }

    public async deleteRetweet(retweet: RecordsEntity): Promise<DeleteResult> {
        if (!retweet) {
            throw new NotFoundException('retweet not found');
        }

        const retweetImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :retweetId`, { retweetId: retweet.id })
            .getMany();

        retweetImages.forEach(async (retweetImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(retweetImage.name);
            await this.recordImagesRepository.remove(retweetImages);
        });

        return this.recordsTreeRepository.delete(retweet);
    }
}
