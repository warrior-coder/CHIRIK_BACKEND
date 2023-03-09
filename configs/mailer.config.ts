import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createMailerOptions(): MailerOptions {
        return {
            transport: {
                host: this.configService.get<string>('MAILER_HOST'),
                port: Number(this.configService.get<number>('MAILER_PORT')),
                secure: Boolean(this.configService.get<boolean>('MAILER_IS_SECURE')),
                auth: {
                    user: this.configService.get<string>('MAILER_USER'),
                    pass: this.configService.get<string>('MAILER_PASS'),
                },
            },
        };
    }
}
