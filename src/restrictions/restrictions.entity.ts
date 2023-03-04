import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

@Entity({ name: 'restrictions' })
export class RestrictionsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'targetUserId' })
    targetUser: UsersEntity;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'initiatorUserId' })
    initiatorUser: UsersEntity;

    @Column({ nullable: true })
    action: string;

    @Column({ nullable: true })
    subject: string;
}
