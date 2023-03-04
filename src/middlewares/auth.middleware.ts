import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

import { JwtPayloadWithUserId } from 'src/interfaces/jwt-payload-with-user-id.interface';
import { JwtPayloadWithUserRolesValues } from 'src/interfaces/jwt-payload-with-user-roles-values.interface';
import { RequestWithUserRolesValues } from 'src/interfaces/request-with-user-roles-values.interface';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

    public async use(request: RequestWithUser & RequestWithUserRolesValues, response: Response, next: NextFunction) {
        try {
            const authorizationHeader = request.headers.authorization;

            if (!authorizationHeader) {
                throw new Error('empty authorization header');
            }

            const [tokenType, tokenValue] = authorizationHeader.split(' ');

            if (tokenType !== 'Bearer' || !tokenValue) {
                throw new Error('bearer token error');
            }

            const payload = this.jwtService.verify<JwtPayloadWithUserId & JwtPayloadWithUserRolesValues>(tokenValue);
            const currentUser = await this.usersService.getUserById(payload.userId);
            const currentUserRolesValues = payload.userRolesValues;

            request.currentUser = currentUser;
            request.currentUserRolesValues = currentUserRolesValues;
        } catch (error) {
            request.currentUser = null;
            request.currentUserRolesValues = [];
        }

        next();
    }
}
