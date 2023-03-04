import { Request } from 'express';

import { UsersEntity } from 'src/users/entities/users.entity';

export interface RequestWithUser extends Request {
    currentUser: UsersEntity | null;
}
