import { PrivacyInfo } from '../interfaces/privacy-info.interface';

export class SessionsEntity {
    public readonly id: string;

    public readonly userId: number;

    public readonly privacyInfo: PrivacyInfo;

    public readonly createdAt: Date;

    public readonly expiresAt: Date;
}
