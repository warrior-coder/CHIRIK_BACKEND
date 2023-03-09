import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { SessionsEntity } from '../entities/session.entity';

@Injectable()
export class CookiesService {
    public putSession(response: Response, session: SessionsEntity) {
        response.cookie('SESSION_ID', session.id, {
            expires: session.expiresAt,
            sameSite: 'strict',
            httpOnly: true,
        });
    }

    public clearSession(response: Response) {
        response.clearCookie('SESSION_ID');
    }
}