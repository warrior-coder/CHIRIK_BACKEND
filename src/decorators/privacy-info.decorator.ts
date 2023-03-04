import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';

export const PrivacyInfoDecorator = createParamDecorator((data: unknown, context: ExecutionContext): PrivacyInfo => {
    const request = context.switchToHttp().getRequest<Request>();

    return {
        userAgent: request.get('user-agent'),
        ipAddress: request.socket.remoteAddress,
    };
});
