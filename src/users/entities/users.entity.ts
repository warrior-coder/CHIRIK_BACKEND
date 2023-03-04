import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';

import { RefreshTokensEntity } from 'src/auth/entities/refresh-tokens.entity';

import { UserProfileImagesEntity } from './users-profile-images.entity';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: Date;

    @OneToMany(() => RefreshTokensEntity, (refreshToken: RefreshTokensEntity) => refreshToken.user)
    refreshTokens: RefreshTokensEntity[];

    @OneToOne(() => UserProfileImagesEntity, (profileImages: UserProfileImagesEntity) => profileImages.user)
    profileImages: UserProfileImagesEntity;
}
