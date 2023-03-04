import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RecordImagesEntity } from './record-images.entity';

@Entity({ name: 'records' })
@Tree('materialized-path')
export class RecordsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: string;

    @Column({ nullable: false })
    isComment: boolean;

    @Column({ nullable: false })
    isRetweet: boolean;

    @Column({ type: 'text' })
    text: string;

    @TreeChildren()
    children: RecordsEntity[];

    @TreeParent({
        onDelete: 'SET NULL',
    })
    parent: RecordsEntity;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'SET NULL',
        eager: true,
    })
    author: UsersEntity;

    @OneToMany(() => RecordImagesEntity, (image: RecordImagesEntity) => image.record, {
        eager: true,
    })
    images: RecordImagesEntity[];

    @Column({ default: false })
    isDeleted: boolean;
}
