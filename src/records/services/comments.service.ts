import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { CommentsCount } from 'src/interfaces/comments-count.interface';
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
    ) {}

    public getCommentById(commentId: number): Promise<RecordsEntity | null> {
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

    public async getCommentByIdOrThrow(commentId: number): Promise<RecordsEntity> {
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

    public getRecordCommentsCount(record: RecordsEntity): Promise<CommentsCount> {
        throw new NotFoundException('record not found');
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
