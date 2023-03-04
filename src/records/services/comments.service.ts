import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { CommentsCount } from 'src/interfaces/comments-count.interface';
import { RestrictionsEntity } from 'src/restrictions/restrictions.entity';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public createRestrictionToCreateComments(
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
            subject: 'comments',
        });

        return this.restrictionsRepository.save(restriction);
    }

    public createRestrictionToReadComments(
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
            subject: 'comments',
        });

        return this.restrictionsRepository.save(restriction);
    }

    public getCommentById(commentId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: commentId,
                isRetweet: false,
                isComment: true,
            },
            relations: {
                images: true,
            },
        });
    }

    public async getCommentByIdOrThrow(commentId: string): Promise<RecordsEntity> {
        const comment = await this.recordsTreeRepository.findOne({
            where: {
                id: commentId,
                isRetweet: false,
                isComment: true,
            },
            relations: {
                images: true,
            },
        });

        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        return comment;
    }

    public async createCommentOnRecord(
        createCommentDto: CreateCommentDto,
        author: UsersEntity,
        record: RecordsEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<RecordsEntity> {
        if (createCommentDto.text === '' && imageFiles.length === 0) {
            throw new BadRequestException('comment cannot be empty');
        }

        if (!record) {
            throw new NotFoundException('record not found');
        }

        const comment = this.recordsTreeRepository.create({
            text: createCommentDto.text,
            isComment: true,
            isRetweet: false,
            author,
            parent: record,
        });

        await this.recordsTreeRepository.save(comment);

        comment.images = await Promise.all(
            imageFiles.map(async (imageFile): Promise<RecordImagesEntity> => {
                const fileName = await this.filesService.writeImageFile(imageFile);
                const image = this.recordImagesRepository.create({
                    name: fileName,
                    record: comment,
                });

                await this.recordImagesRepository.save(image);

                image.record = undefined;

                return image;
            }),
        );

        return comment;
    }

    public async getRecordCommentsCount(record: RecordsEntity): Promise<CommentsCount> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        const recordDescendantsTree = await this.recordsTreeRepository.findDescendantsTree(record);
        const commentsCount = this.findCommentsCountInRecordDescendantsTree(recordDescendantsTree);

        return {
            commentsCount,
        };
    }

    private findCommentsCountInRecordDescendantsTree(recordDescendantsTree: RecordsEntity) {
        let commentsCount = 0;

        recordDescendantsTree.children.forEach((childRecord: RecordsEntity): void => {
            if (childRecord.isComment) {
                commentsCount = commentsCount + 1 + this.findCommentsCountInRecordDescendantsTree(childRecord);
            }
        });

        return commentsCount;
    }

    public async getRecordCommentsTree(record: RecordsEntity): Promise<RecordsEntity> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        const recordDescendantsTree = await this.recordsTreeRepository.findDescendantsTree(record, {
            relations: ['images'],
        });

        const recordCommentsTree = this.filterRecordDescendantsTreeForCommentsTree(recordDescendantsTree);

        return recordCommentsTree;
    }

    public getUpperLevelCommentsOfRecord(record: RecordsEntity): Promise<RecordsEntity[]> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        return this.recordsTreeRepository
            .createQueryBuilder('records')
            .leftJoinAndSelect('records.images', 'images')
            .leftJoinAndSelect('records.author', 'author')
            .where(`records."parentId" = :recordId`, { recordId: record.id })
            .orderBy('records.createdAt', 'DESC')
            .getMany();
    }

    public getPaginatedUpperLevelCommentsOfRecord(
        record: RecordsEntity,
        page: number,
        limit: number,
    ): Promise<RecordsEntity[]> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        return this.recordsTreeRepository
            .createQueryBuilder('records')
            .leftJoinAndSelect('records.images', 'images')
            .leftJoinAndSelect('records.author', 'author')
            .where(`records."parentId" = :recordId`, { recordId: record.id })
            .orderBy('records.createdAt', 'DESC')
            .skip(page * limit)
            .take(limit)
            .getMany();
    }

    private filterRecordDescendantsTreeForCommentsTree(recordDescendantsTree: RecordsEntity): RecordsEntity {
        recordDescendantsTree.children = recordDescendantsTree.children.filter(
            (recordChild: RecordsEntity): boolean => {
                if (recordChild.isComment) {
                    recordChild = this.filterRecordDescendantsTreeForCommentsTree(recordChild);

                    return true;
                } else {
                    return false;
                }
            },
        );

        return recordDescendantsTree;
    }

    public async clearCommentAndMarkAsDeleted(comment: RecordsEntity): Promise<RecordsEntity> {
        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        const commentImages = await this.recordImagesRepository
            .createQueryBuilder('record_images')
            .where(`record_images."recordId" = :commentId`, { commentId: comment.id })
            .getMany();

        commentImages.forEach((commentImage: RecordImagesEntity) => {
            this.filesService.removeImageFile(commentImage.name);
            this.recordImagesRepository.delete(commentImage);
        });

        comment.text = '';
        comment.isDeleted = true;

        return this.recordsTreeRepository.save(comment);
    }
}
