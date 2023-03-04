import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecordsEntity } from './records.entity';

@Entity({ name: 'record_images' })
export class RecordImagesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @ManyToOne(() => RecordsEntity, (record: RecordsEntity) => record.images, {
        onDelete: 'CASCADE',
    })
    record: RecordsEntity;
}
