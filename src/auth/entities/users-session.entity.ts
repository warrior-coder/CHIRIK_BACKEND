import { PrivacyInfo } from '../interfaces/privacy-info.interface';

export class UserSessionsEntity {
    id: string;
    userId: number;
    privacyInfo: PrivacyInfo;
}
