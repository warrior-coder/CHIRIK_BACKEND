export interface JwtPayloadWithUserRolesValues {
    exp: number;
    iat: number;
    userRolesValues: string[];
}
