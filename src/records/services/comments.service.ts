import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { RecordCommentsEntity } from '../entities/record-comments.entity';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>,
        @InjectRepository(RecordCommentsEntity)
        private readonly recordCommentsRepository: Repository<RecordCommentsEntity>,
        @InjectRepository(RecordImagesEntity) private readonly recordImagesRepository: Repository<RecordImagesEntity>,
        private readonly filesService: FilesService,
    ) {}

    public getCommentById(commentId: number): Promise<RecordsEntity | null> {
        return this.recordsRepository.findOne({
            where: {
                id: commentId,
            },
            relations: {
                images: true,
            },
        });
    }

    public async getCommentByIdOrThrow(commentId: number): Promise<RecordsEntity> {
        const comment = await this.recordsRepository.findOne({
            where: {
                id: commentId,
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

    public createCommentOnRecord(
        createCommentDto: CreateCommentDto,
        author: UsersEntity,
        record: RecordsEntity,
    ): Promise<RecordCommentsEntity> {
        if (createCommentDto.text === '') {
            throw new BadRequestException('comment cannot be empty');
        }

        if (!record) {
            throw new NotFoundException('record not found');
        }

        const comment = this.recordCommentsRepository.create({
            text: createCommentDto.text,
            author,
            record,
        });

        return this.recordCommentsRepository.save(comment);
    }

    public getRecordCommentsCount(record: RecordsEntity): Promise<number> {
        throw new Error('Method not implemented.');
    }

    public getRecordComments(record: RecordsEntity): Promise<RecordCommentsEntity> {
        throw new Error('Method not implemented.');
    }

    public clearCommentAndMarkAsDeleted(comment: RecordsEntity) {
        throw new Error('Method not implemented.');
    }
}
