import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createJwtOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            signOptions: {
                expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
            },
        };
    }
}
