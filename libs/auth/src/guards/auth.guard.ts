import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { RequestWithCurrentUserId } from 'src/auth/interfaces/request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithCurrentUserId>();

        if (!request.currentUserId) {
            throw new UnauthorizedException('User not authorized.');
        }

        return true;
    }
}
