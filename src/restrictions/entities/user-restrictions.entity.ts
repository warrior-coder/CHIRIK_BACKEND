export interface UserRestrictionsEntity {
    id: number;
    action: string;
    subject: string;
    user_id: number;
    restricted_user_id: number;
}
