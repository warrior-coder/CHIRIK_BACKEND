import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'record_likes' })
export class RecordLikesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => RecordsEntity, {
        onDelete: 'CASCADE',
    })
    record: RecordsEntity;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
    })
    user: UsersEntity;
}
