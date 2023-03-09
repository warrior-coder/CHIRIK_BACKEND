import { UsersEntity } from 'src/users/entities/users.entity';

import { SessionsEntity } from '../entities/session.entity';

export interface UserAndSession {
    user: UsersEntity;
    session: SessionsEntity;
}
