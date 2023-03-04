import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { UsersEntity } from './users.entity';

@Entity({ name: 'user_profile_images' })
export class UserProfileImagesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    avatarImageName: string;

    @Column({ nullable: false })
    coverImageName: string;

    @OneToOne(() => UsersEntity, (user: UsersEntity) => user.profileImages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;
}
