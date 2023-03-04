import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUserRolesValues } from 'src/interfaces/request-with-user-roles-values.interface';

export const CurrentUserRolesDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext): Array<string> => {
        const requestWithUserRolesValues = context.switchToHttp().getRequest<RequestWithUserRolesValues>();

        return requestWithUserRolesValues.currentUserRolesValues;
    },
);
