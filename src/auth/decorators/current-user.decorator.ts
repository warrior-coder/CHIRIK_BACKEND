import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithCurrentUserId } from '../interfaces/request-with-user.interface';

export const CurrentUserIdDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext): number | null => {
        const requestWithUser = context.switchToHttp().getRequest<RequestWithCurrentUserId>();

        return requestWithUser.currentUserId;
    },
);
