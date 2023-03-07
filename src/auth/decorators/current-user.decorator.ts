import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RequestWithUser } from '../interfaces/request-with-user.interface';

export const CurrentUserDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext): UsersEntity | null => {
        const requestWithUser = context.switchToHttp().getRequest<RequestWithUser>();

        return requestWithUser.currentUser;
    },
);
