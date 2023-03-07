import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordImagesEntity } from './record-images.entity';

@Entity({ name: 'records' })
export class RecordsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @Column({ type: 'text', nullable: false })
    text: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'author_id' })
    author: UsersEntity;

    @OneToMany(() => RecordImagesEntity, (image: RecordImagesEntity) => image.record)
    images: RecordImagesEntity[];
}
