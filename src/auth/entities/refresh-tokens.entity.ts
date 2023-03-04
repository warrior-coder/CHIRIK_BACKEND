import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', nullable: false, unique: true })
    value: string;

    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.refreshTokens, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;
}
