import { Injectable } from '@nestjs/common';
import { NestPgPool, PgConnection } from 'nest-pg';

import { RecordLikesEntity } from '../entities/record-likes.entity';

@Injectable()
export class LikesService {
    constructor(@PgConnection() private readonly pgConnection: NestPgPool) {}

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

    public async getLikesCountOnRecord(recordId: number): Promise<number> {
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
