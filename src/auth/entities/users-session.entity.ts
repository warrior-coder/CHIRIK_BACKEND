import { PrivacyInfo } from '../interfaces/privacy-info.interface';

export interface UserSessionsEntity {
    id: string;
    userId: number;
    privacyInfo: PrivacyInfo;
}
