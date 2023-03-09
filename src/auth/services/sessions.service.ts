import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';

import { UsersEntity } from 'src/users/entities/users.entity';

import { SessionsEntity } from '../entities/session.entity';
import { PrivacyInfo } from '../interfaces/privacy-info.interface';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRedis() private readonly redisRepository: Redis,
        private readonly configService: ConfigService,
    ) {}

    public async createSession(user: UsersEntity, privacyInfo: PrivacyInfo): Promise<SessionsEntity> {
        const sessionLifetimeInMilliseconds = Number(
            this.configService.get<number>('SESSION_LIFETIME_IN_MILLISECONDS'),
        );
        const session: SessionsEntity = {
            id: uuid.v4(),
            userId: user.id,
            privacyInfo,
            createdAt: new Date(),
            expiresAt: new Date(new Date().getTime() + sessionLifetimeInMilliseconds),
        };

        await this.redisRepository.set(session.id, JSON.stringify(session), 'PX', sessionLifetimeInMilliseconds);

        return session;
    }
}
