import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { UserSessionsEntity } from 'src/auth/entities/users-session.entity';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService, @InjectRedis() private readonly redisRepository: Redis) {}

    public async use(request: RequestWithUser, response: Response, next: NextFunction) {
        const sessionId = request.cookies['SESSION_ID'];

        if (!sessionId) {
            throw new UnauthorizedException('No SESSION_ID in cookies.');
        }

        const userSession: UserSessionsEntity = JSON.parse(await this.redisRepository.get(sessionId));

        if (userSession) {
            const currentUser = await this.usersService.getUserById(userSession.userId);

            request.currentUser = currentUser;
        } else {
            request.currentUser = null;
        }

        next();
    }
}
