import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'record_images' })
export class RecordImagesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'file_name', nullable: false, unique: true })
    fileName: string;

    @ManyToOne(() => RecordsEntity, (record: RecordsEntity) => record.images, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'record_id' })
    record: RecordsEntity;
}
