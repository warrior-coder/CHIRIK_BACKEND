import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithUser>();

        if (!request.currentUser) {
            throw new UnauthorizedException('user not authorized');
        }

        return true;
    }
}
