import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { FilesService } from 'src/files/files.service';
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
        if (!createRecordDto.text) {
            throw new BadRequestException('Record has no text.');
        }

        const insertedRecords: RecordsEntity[] = await this.recordsRepository.query(
            `
                INSERT INTO records("text", author_id)
                VALUES ($1::TEXT, $2::INT)
                RETURNING id, "text", created_at, author_id;
            `,
            [createRecordDto.text, author.id],
        );
        const record: RecordsEntity = insertedRecords[0];

        record.images = [];

        for (const imageFile of imageFiles) {
            const fileName = await this.filesService.writeImageFile(imageFile);
            const insertedRecordImages: RecordImagesEntity[] = await this.recordsRepository.query(
                `
                    INSERT INTO record_images(file_name, record_id)
                    VALUES ($1, $2)
                    RETURNING id, file_name, record_id;
                `,
                [fileName, record.id],
            );
            const recordImage: RecordImagesEntity = insertedRecordImages[0];

            record.images.push(recordImage);
        }

        return record;
    }

    public deleteRecord(record: RecordsEntity): Promise<DeleteResult> {
        if (!record) {
            throw new NotFoundException('Record not found.');
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
        const records: RecordsEntity[] = await this.recordsRepository.query(
            `
                SELECT r.*
                FROM records AS r
                WHERE r.id = $1::INT
                LIMIT 1;
            `,
            [recordId],
        );
        const record: RecordsEntity | undefined = records[0];

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
        const records: RecordsEntity[] = await this.recordsRepository.query(
            `
                SELECT r.*
                FROM records AS r
                WHERE r.id = $1::INT
                LIMIT 1;
            `,
            [recordId],
        );
        const record: RecordsEntity | undefined = records[0];

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

    public getRecordLikesCount(record: RecordsEntity): Promise<number> {
        if (!record) {
            throw new NotFoundException('record not found');
        }

        return this.recordLikesRepository.count({
            where: {
                record,
            },
        });
    }
}
