import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'record_likes' })
export class RecordLikesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RecordsEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'record_id' })
    record: RecordsEntity;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;
}
