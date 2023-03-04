import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

@Entity({ name: 'users_roles' })
export class UsersRolesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    role: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;
}
