import { RecordCommentsEntity } from './record-comments.entity';
import { RecordImagesEntity } from './record-images.entity';

export interface RecordsEntity {
    id: number;
    text: string;
    created_at: string;
    author_id: number;

    images?: RecordImagesEntity[];
    comments?: RecordCommentsEntity[];
}
