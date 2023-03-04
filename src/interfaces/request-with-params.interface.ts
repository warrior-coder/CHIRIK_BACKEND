import { Request } from 'express';

export interface RequestWithParamsUserId extends Request {
    params: {
        userId: string;
    };
}
