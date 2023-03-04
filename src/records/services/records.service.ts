import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';

import { LikesCount } from 'src/interfaces/likes-count.interface';
import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordLikesEntity } from '../entities/record-likes.entity';
import { RecordsEntity } from '../entities/records.entity';

@Injectable()
export class RecordsService {
    constructor(
        @InjectRepository(RecordsEntity) private readonly recordsTreeRepository: TreeRepository<RecordsEntity>,
        @InjectRepository(RecordLikesEntity) private readonly recordLikesRepository: Repository<RecordLikesEntity>,
    ) {}

    public getRecordById(recordId: string): Promise<RecordsEntity | null> {
        return this.recordsTreeRepository.findOne({
            where: {
                id: recordId,
            },
            relations: {
                author: true,
                images: true,
            },
        });
    }

    public getRecordByIdOrThrow(recordId: string): Promise<RecordsEntity> {
        const record = this.recordsTreeRepository.findOne({
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
