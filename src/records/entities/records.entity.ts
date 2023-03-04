import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordImagesEntity } from './record-images.entity';

@Entity({ name: 'records' })
export class RecordsEntity {
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
    author: UsersEntity;

    @OneToMany(() => RecordImagesEntity, (image: RecordImagesEntity) => image.record)
    images: RecordImagesEntity[];
}
