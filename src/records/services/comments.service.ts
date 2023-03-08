import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { EditCommentDto } from '../dto/edit-comment.dto';
import { RecordCommentsEntity } from '../entities/record-comments.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class CommentsService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

    public async getCommentById(commentId: number): Promise<RecordCommentsEntity | null> {
        const selectedRows: RecordCommentsEntity[] = await this.pgConnection.rows<RecordCommentsEntity>(
            `
                SELECT rc.*
                FROM record_comments AS rc
                WHERE rc.id = $1::INT;
            `,
            [commentId],
        );
        const comment: RecordCommentsEntity | undefined = selectedRows[0];

        if (!comment) {
            return null;
        }

        return comment;
    }

    public async getCommentByIdOrThrow(commentId: number): Promise<RecordCommentsEntity> {
        const selectedRows: RecordCommentsEntity[] = await this.pgConnection.rows<RecordCommentsEntity>(
            `
                SELECT rc.*
                FROM record_comments AS rc
                WHERE rc.id = $1::INT;
            `,
            [commentId],
        );
        const comment: RecordCommentsEntity | undefined = selectedRows[0];

        if (!comment) {
            throw new NotFoundException('Comment not found.');
        }

        return comment;
    }

    public async createCommentOnRecord(
        createCommentDto: CreateCommentDto,
        authorId: number,
        recordId: number,
    ): Promise<RecordCommentsEntity> {
        if (!createCommentDto.text) {
            throw new BadRequestException('Comment has no text.');
        }

        const insertedRows: RecordCommentsEntity[] = await this.pgConnection.rows<RecordCommentsEntity>(
            `
                INSERT INTO record_comments("text", author_id, record_id)
                VALUES ($1::TEXT, $2::INT, $3::INT)
                RETURNING id, "text", author_id, record_id;
            `,
            [createCommentDto.text, authorId, recordId],
        );
        const comment: RecordCommentsEntity = insertedRows[0];

        return comment;
    }

    public async editComment(
        comment: RecordCommentsEntity,
        editCommentDto: EditCommentDto,
    ): Promise<RecordCommentsEntity> {
        if (!comment) {
            throw new NotFoundException('Comment not found.');
        }

        if (!editCommentDto.text) {
            throw new BadRequestException('Comment has no text.');
        }

        const updatedRows: RecordCommentsEntity[] = await this.pgConnection.rows<RecordCommentsEntity>(
            `
                UPDATE record_comments
                SET "text" = $1::TEXT
                WHERE id = $2::INT
                RETURNING id, "text", created_at, author_id, record_id;
            `,
            [editCommentDto.text, comment.id],
        );
        const updatedComment: RecordCommentsEntity = updatedRows[0];

        return updatedComment;
    }

    public async getRecordCommentsCount(record: RecordsEntity): Promise<number> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        const queryResultRows = await this.pgConnection.rows<any>(
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

        return this.pgConnection.rows<RecordCommentsEntity>(
            `
                SELECT rc.*
                FROM record_comments AS rc
                WHERE rc.record_id = $1::INT;
            `,
            [record.id],
        );
    }

    public deleteComment(comment: RecordCommentsEntity): Promise<any> {
        if (!comment) {
            throw new NotFoundException('Comment not found.');
        }

        return this.pgConnection.rows<any>(
            `
                DELETE
                FROM record_comments AS rc
                WHERE rc.id = $1::INT;
            `,
            [comment.id],
        );
    }
}
