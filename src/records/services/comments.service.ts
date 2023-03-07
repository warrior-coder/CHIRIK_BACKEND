import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { RecordCommentsEntity } from '../entities/record-comments.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>,
        @InjectRepository(RecordCommentsEntity)
        private readonly recordCommentsRepository: Repository<RecordCommentsEntity>,
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

    public async createCommentOnRecord(
        createCommentDto: CreateCommentDto,
        author: UsersEntity,
        record: RecordsEntity,
    ): Promise<RecordCommentsEntity> {
        if (!author) {
            throw new NotFoundException('Author not found.');
        }

        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        if (createCommentDto.text === '') {
            throw new BadRequestException('Comment has no text.');
        }

        const insertedRows: RecordCommentsEntity[] = await this.recordsRepository.query(
            `
                INSERT INTO record_comments("text", author_id, record_id)
                VALUES ($1::TEXT, $2::INT, $3::INT)
                RETURNING id, "text", author_id, record_id;
            `,
            [createCommentDto.text, author.id, record.id],
        );
        const recordComment: RecordCommentsEntity = insertedRows[0];

        return recordComment;
    }

    public async getRecordCommentsCount(record: RecordsEntity): Promise<number> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        const queryResultRows = await this.recordsRepository.query(
            `
                SELECT COUNT(*) AS record_comments_count
                FROM record_comments AS rc
                WHERE rc.record_id = $1::INT;
            `,
            [record.id],
        );
        const recordCommentsCount: number = parseInt(queryResultRows[0]['record_comments_count']);

        return recordCommentsCount;
    }

    public getRecordComments(record: RecordsEntity): Promise<RecordCommentsEntity[]> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        return this.recordsRepository.query(
            `
                SELECT rc.*
                FROM record_comments AS rc
                WHERE rc.record_id = $1::INT;
            `,
            [record.id],
        );
    }

    public deleteComment(comment: RecordsEntity) {
        throw new Error('Method not implemented.');
    }
}
