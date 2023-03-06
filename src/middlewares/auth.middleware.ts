import { CACHE_MANAGER, Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Response, NextFunction } from 'express';

import { UserSessionsEntity } from 'src/auth/entities/users-session.entity';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly usersService: UsersService,
    ) {}

    public async use(request: RequestWithUser, response: Response, next: NextFunction) {
        const sessionId = request.cookies['SESSION_ID'];

        if (!sessionId) {
            throw new UnauthorizedException('No SESSION_ID in cookies.');
        }

        const userSession: UserSessionsEntity = await this.cacheManager.get<UserSessionsEntity>(sessionId);

        if (userSession) {
            const currentUser = await this.usersService.getUserById(userSession.userId);

            request.currentUser = currentUser;
        } else {
            request.currentUser = null;
        }

        next();
    }
}
