import { Permission } from 'src/interfaces/permission.interface';

export const defaultPermissions: Permission[] = [
    { action: 'read', subject: 'tweets' },
    { action: 'read', subject: 'retweets' },
    { action: 'create', subject: 'retweets' },
    { action: 'create', subject: 'comments' },
];
