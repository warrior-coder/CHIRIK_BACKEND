import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { UsersService } from 'src/users/services/users.service';

import { SessionsEntity } from '../entities/session.entity';
import { RequestWithCurrentUserId } from '../interfaces/request-with-user.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService, @InjectRedis() private readonly redisRepository: Redis) {}

    public async use(request: RequestWithCurrentUserId, response: Response, next: NextFunction): Promise<void> {
        const sessionId = request.cookies['SESSION_ID'];

        if (!sessionId) {
            throw new UnauthorizedException('No SESSION_ID in cookies.');
        }

        const session: SessionsEntity = JSON.parse(await this.redisRepository.get(sessionId));

        if (session) {
            request.currentUserId = session.userId;
        } else {
            request.currentUserId = null;
        }

        next();
    }
}
