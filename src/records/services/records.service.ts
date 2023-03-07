import { FilesService } from '@app/files';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { CreateRecordDto } from '../dto/create-record.dto';
import { RecordImagesEntity } from '../entities/record-images.entity';
import { RecordLikesEntity } from '../entities/record-likes.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsRepository: Repository<RecordsEntity>,
        private readonly filesService: FilesService,
    ) {}

    public async getAllUserRecords(user: UsersEntity): Promise<RecordsEntity[]> {
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const allUserRecords: RecordsEntity[] = await this.recordsRepository.query(
            `
                SELECT r.*
                FROM records AS r
                INNER JOIN users u ON u.id = r.author_id
                WHERE r.author_id = $1::INT
                ORDER BY r.created_at DESC;
            `,
            [user.id],
        );

        for (const userRecord of allUserRecords) {
            const recordImages: RecordImagesEntity[] = await this.recordsRepository.query(
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
        const allRecords: RecordsEntity[] = await this.recordsRepository.query(`
            SELECT r.*
            FROM records AS r
            ORDER BY r.created_at DESC;
        `);

        for (const record of allRecords) {
            const recordImages: RecordImagesEntity[] = await this.recordsRepository.query(
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
        author: UsersEntity,
        imageFiles: Array<Express.Multer.File> = [],
    ): Promise<any> {
        if (!author) {
            throw new NotFoundException('Author not found.');
        }

        if (!createRecordDto.text) {
            throw new BadRequestException('Record has no text.');
        }

        const insertedRows: RecordsEntity[] = await this.recordsRepository.query(
            `
                INSERT INTO records("text", author_id)
                VALUES ($1::TEXT, $2::INT)
                RETURNING id, "text", created_at, author_id;
            `,
            [createRecordDto.text, author.id],
        );
        const record: RecordsEntity = insertedRows[0];

        record.images = [];

        for (const imageFile of imageFiles) {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const insertedRows: RecordImagesEntity[] = await this.recordsRepository.query(
                `
                    INSERT INTO record_images(file_name, record_id)
                    VALUES ($1, $2)
                    RETURNING id, file_name, record_id;
                `,
                [fileName, record.id],
            );
            const recordImage: RecordImagesEntity = insertedRows[0];

            record.images.push(recordImage);
        }

        return record;
    }

    public deleteRecord(record: RecordsEntity): Promise<DeleteResult> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        for (const recordImage of record.images) {
            this.filesService.removeImageFile(recordImage['file_name']);
        }

        return this.recordsRepository.query(
            `
                DELETE
                FROM records AS r
                WHERE r.id = $1::INT;
            `,
            [record.id],
        );
    }

    public async getRecordById(recordId: number): Promise<RecordsEntity | null> {
        const selectedRows: RecordsEntity[] = await this.recordsRepository.query(
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

        const recordImages: RecordImagesEntity[] = await this.recordsRepository.query(
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
        const selectedRows: RecordsEntity[] = await this.recordsRepository.query(
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

        const recordImages: RecordImagesEntity[] = await this.recordsRepository.query(
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

    public async createLikeOnRecord(record: RecordsEntity, user: UsersEntity): Promise<RecordLikesEntity> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const insertedRows: RecordLikesEntity[] = await this.recordsRepository.query(
            `
                INSERT INTO record_likes(record_id, user_id)
                VALUES ($1::INT, $2::INT)
                RETURNING id, record_id, user_id;
            `,
            [record.id, user.id],
        );
        const recordLike: RecordLikesEntity = insertedRows[0];

        return recordLike;
    }

    public deleteLikeFromRecord(record: RecordsEntity, user: UsersEntity): Promise<DeleteResult> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return this.recordsRepository.query(
            `
                DELETE
                FROM record_likes AS rl
                WHERE rl.record_id = $1::INT AND rl.user_id = $2::INT;
            `,
            [record.id, user.id],
        );
    }

    public async getRecordLikesCount(record: RecordsEntity): Promise<number> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        const queryResultRows = await this.recordsRepository.query(
            `
                SELECT COUNT(*) AS record_likes_count
                FROM record_likes AS rl
                WHERE rl.record_id = $1;
            `,
            [record.id],
        );
        const recordLikesCount: number = parseInt(queryResultRows[0]['record_likes_count']);

        return recordLikesCount;
    }

    public async getIsLikeOnRecordExists(record: RecordsEntity, user: UsersEntity): Promise<boolean> {
        if (!record) {
            throw new NotFoundException('Record not found.');
        }

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const queryResultRows = await this.recordsRepository.query(
            `
                SELECT EXISTS(
                    SELECT *
                    FROM record_likes AS rl
                    WHERE rl.record_id = $1::INT AND rl.user_id = $2::INT
                ) AS is_like_exists;
            `,
            [record.id, user.id],
        );

        const isLikeOnRecordExists = Boolean(queryResultRows[0]['is_like_exists']);

        return isLikeOnRecordExists;
    }
}
