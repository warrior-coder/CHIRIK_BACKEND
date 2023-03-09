import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { FilesService } from '@app/files';
import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateRecordDto } from '../dto/create-record.dto';
import { EditRecordDto } from '../dto/edit-record.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordLikesEntity } from '../entities/record-likes.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class RecordsService {
    constructor(
        private readonly filesService: FilesService,
        @PgConnection() private readonly pgConnection: NestPgPool,
    ) {}

    public async getAllUserRecords(userId: number): Promise<RecordsEntity[]> {
        const allUserRecords: RecordsEntity[] = await this.pgConnection.rows<RecordsEntity>(
            `
                SELECT r.*
                FROM records AS r
                INNER JOIN users u ON u.id = r.author_id
                WHERE r.author_id = $1::INT
                ORDER BY r.created_at DESC;
            `,
            [userId],
        );

        for (const userRecord of allUserRecords) {
            const recordImages: RecordImagesEntity[] = await this.pgConnection.rows<RecordImagesEntity>(
                `
                    SELECT ri.*
                    FROM record_images AS ri
                    WHERE ri.record_id = $1::INT;
                `,
                [userRecord.id],
            );

            userRecord.images = recordImages;
        }

        return allUserRecords;
    }

    public async getAllRecords(): Promise<RecordsEntity[]> {
        const allRecords: RecordsEntity[] = await this.pgConnection.rows<RecordsEntity>(`
            SELECT r.*
            FROM records AS r
            ORDER BY r.created_at DESC;
        `);

        for (const record of allRecords) {
            const recordImages: RecordImagesEntity[] = await this.pgConnection.rows<RecordImagesEntity>(
                `
                    SELECT ri.*
                    FROM record_images AS ri
                    WHERE ri.record_id = $1::INT;
                `,
                [record.id],
            );

            record.images = recordImages;
        }

        return allRecords;
    }

    public async createRecord(
        createRecordDto: CreateRecordDto,
        authorId: number,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<any> {
        if (!createRecordDto.text) {
            throw new BadRequestException('Record has no text.');
        }

        const insertedRows: RecordsEntity[] = await this.pgConnection.rows<RecordsEntity>(
            `
                INSERT INTO records("text", author_id)
                VALUES ($1::TEXT, $2::INT)
                RETURNING id, "text", created_at, author_id;
            `,
            [createRecordDto.text, authorId],
        );
        const record: RecordsEntity = insertedRows[0];

        record.images = [];

        for (const imageFile of imageFiles) {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const insertedRows: RecordImagesEntity[] = await this.pgConnection.rows<RecordImagesEntity>(
                `
                    INSERT INTO record_images(file_name, record_id)
                    VALUES ($1::VARCHAR(64), $2::INT)
                    RETURNING id, file_name, record_id;
                `,
                [fileName, record.id],
            );
            const recordImage: RecordImagesEntity = insertedRows[0];

            record.images.push(recordImage);
        }

        return record;
    }

    public editRecord(record: RecordsEntity, editRecordDto: EditRecordDto) {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        if (!editRecordDto.text) {
            throw new BadRequestException('Record has no text.');
        }

        return this.pgConnection.rows<RecordsEntity>(
            `
                UPDATE records
                SET "text" = $1::TEXT
                WHERE id = $2::INT
                RETURNING id, "text", created_at, author_id;
            `,
            [editRecordDto.text, record.id],
        );
    }

    public async deleteRecord(recordId: number): Promise<any> {
        const record = await this.getRecordById(recordId);

        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        for (const recordImage of record.images) {
            this.filesService.removeImageFile(recordImage['file_name']);
        }

        return this.pgConnection.rows<any>(
            `
                DELETE
                FROM records AS r
                WHERE r.id = $1::INT;
            `,
            [record.id],
        );
    }

    public async getRecordById(recordId: number): Promise<RecordsEntity | null> {
        const selectedRows: RecordsEntity[] = await this.pgConnection.rows<RecordsEntity>(
            `
                SELECT r.*
                FROM records AS r
                WHERE r.id = $1::INT
                LIMIT 1;
            `,
            [recordId],
        );
        const record: RecordsEntity | undefined = selectedRows[0];

        if (!record) {
            return null;
        }

        const recordImages: RecordImagesEntity[] = await this.pgConnection.rows<RecordImagesEntity>(
            `
                SELECT ri.*
                FROM record_images AS ri
                WHERE ri.record_id = $1::INT;
            `,
            [record.id],
        );

        record.images = recordImages;

        return record;
    }

    public async getRecordByIdOrThrow(recordId: number): Promise<RecordsEntity> {
        const selectedRows: RecordsEntity[] = await this.pgConnection.rows<RecordsEntity>(
            `
                SELECT r.*
                FROM records AS r
                WHERE r.id = $1::INT
                LIMIT 1;
            `,
            [recordId],
        );
        const record: RecordsEntity | undefined = selectedRows[0];

        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        const recordImages: RecordImagesEntity[] = await this.pgConnection.rows<RecordImagesEntity>(
            `
                SELECT ri.*
                FROM record_images AS ri
                WHERE ri.record_id = $1::INT;
            `,
            [record.id],
        );

        record.images = recordImages;

        return record;
    }

    public async createLikeOnRecord(recordId: number, userId: number): Promise<RecordLikesEntity> {
        const insertedRows: RecordLikesEntity[] = await this.pgConnection.rows<RecordLikesEntity>(
            `
                INSERT INTO record_likes(record_id, user_id)
                VALUES ($1::INT, $2::INT)
                RETURNING id, record_id, user_id;
            `,
            [recordId, userId],
        );
        const recordLike: RecordLikesEntity = insertedRows[0];

        return recordLike;
    }

    public deleteLikeFromRecord(recordId: number, userId: number): Promise<any> {
        return this.pgConnection.rows<any>(
            `
                DELETE
                FROM record_likes AS rl
                WHERE rl.record_id = $1::INT AND rl.user_id = $2::INT;
            `,
            [recordId, userId],
        );
    }

    public async getRecordLikesCount(recordId: number): Promise<number> {
        const queryResultRows = await this.pgConnection.rows<any>(
            `
                SELECT COUNT(*) AS record_likes_count
                FROM record_likes AS rl
                WHERE rl.record_id = $1::INT;
            `,
            [recordId],
        );
        const recordLikesCount: number = parseInt(queryResultRows[0]['record_likes_count']);

        return recordLikesCount;
    }

    public async getIsLikeOnRecordExists(recordId: number, userId: number): Promise<boolean> {
        const queryResultRows = await this.pgConnection.rows<any>(
            `
                SELECT EXISTS(
                    SELECT *
                    FROM record_likes AS rl
                    WHERE rl.record_id = $1::INT AND rl.user_id = $2::INT
                ) AS is_like_exists;
            `,
            [recordId, userId],
        );

        const isLikeOnRecordExists = Boolean(queryResultRows[0]['is_like_exists']);

        return isLikeOnRecordExists;
    }
}
