import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';

export class UserSessionsEntity {
    id: string;
    userId: number;
    privacyInfo: PrivacyInfo;
}
