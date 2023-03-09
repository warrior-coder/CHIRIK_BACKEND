import { Request } from 'express';

export interface RequestWithCurrentUserId extends Request {
    currentUserId: number | null;
}
