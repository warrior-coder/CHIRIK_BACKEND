import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

@Entity({ name: 'users_roles' })
export class UsersRolesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleValue: string;

    @ManyToOne(() => UsersEntity, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({ name: 'userId' })
    user: UsersEntity;
}
