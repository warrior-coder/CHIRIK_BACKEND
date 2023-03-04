import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'record_comments' })
export class RecordCommentsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @Column({ type: 'text' })
    text: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'authorId' })
    author: UsersEntity;

    @ManyToOne(() => RecordsEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'recordId' })
    record: UsersEntity;
}
