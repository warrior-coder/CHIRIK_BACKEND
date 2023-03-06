import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CookiesDecorator = createParamDecorator((data: unknown, context: ExecutionContext): any | null => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.cookies;
});
