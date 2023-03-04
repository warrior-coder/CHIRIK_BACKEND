import { Request } from 'express';

export interface RequestWithUserRolesValues extends Request {
    currentUserRolesValues: Array<string>;
}
