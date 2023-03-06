import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'record_comments' })
export class RecordCommentsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    text: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'author_id' })
    author: UsersEntity;

    @ManyToOne(() => RecordsEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'record_id' })
    record: UsersEntity;
}
