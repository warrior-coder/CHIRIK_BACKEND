export interface JwtPayloadWithUserId {
    exp: number;
    iat: number;
    userId: number;
}
