import { PrivacyInfo } from './privacy-info.interface';

export interface UserSessionEntity {
    id: string;
    loggedAt: Date;
    privacyInfo: PrivacyInfo;
    userId: string;
}
