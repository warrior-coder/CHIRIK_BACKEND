import { UsersEntity } from 'src/users/entities/users.entity';

export interface UserEntityWithJwtPair {
    accessToken: string;
    refreshToken: string;
    user: UsersEntity;
}
