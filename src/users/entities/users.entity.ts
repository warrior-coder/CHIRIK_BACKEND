import { RecordsEntity } from 'src/records/entities/records.entity';

export interface UsersEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: string;

    records?: RecordsEntity[];
}
