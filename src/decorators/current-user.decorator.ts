import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UsersEntity } from 'src/users/entities/users.entity';

export const CurrentUserDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext): UsersEntity | null => {
        const requestWithUser = context.switchToHttp().getRequest<RequestWithUser>();

        return requestWithUser.currentUser;
    },
);
