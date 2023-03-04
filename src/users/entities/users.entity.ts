import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { RefreshTokensEntity } from 'src/auth/entities/refresh-tokens.entity';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
}
