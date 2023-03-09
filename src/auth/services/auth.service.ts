import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { SentMessageInfo } from 'nodemailer';
import * as uuid from 'uuid';

import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { UserSessionsEntity } from '../entities/users-session.entity';
import { PrivacyInfo } from '../interfaces/privacy-info.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        @InjectRedis() private readonly redisRepository: Redis,
    ) {}

    public async signUpUser(signUpUserDto: SignUpUserDto): Promise<SentMessageInfo> {
        const candidateUser = await this.usersService.getUserByEmail(signUpUserDto.email);
        if (candidateUser) {
            throw new BadRequestException('User already exists.');
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');

        await this.redisRepository.set(verificationCode, JSON.stringify(signUpUserDto), 'EX', 5 * 60); // s: 5m * 60s

        return this.sendConfirmationEmail(signUpUserDto.email, verificationCode);
    }

    public async confirmEmailAndGetSignUpUserDto(verificationCode: string): Promise<SignUpUserDto> {
        const redisObject = await this.redisRepository.get(verificationCode);

        if (!redisObject) {
            throw new BadRequestException('Invalid verification code.');
        }

        const signUpUserDto: SignUpUserDto = JSON.parse(redisObject);

        await this.redisRepository.del(verificationCode);

        return signUpUserDto;
    }

    public async registerUser(signUpUserDto: SignUpUserDto, privacyInfo: PrivacyInfo): Promise<any> {
        const hashedPassword = await bcryptjs.hash(signUpUserDto.password, 4);
        const user = await this.usersService.createUser({
            ...signUpUserDto,
            password: hashedPassword,
        });
        const userSession = await this.createUserSession(user, privacyInfo);

        return {
            user,
            userSession,
        };
    }

    public async signInUser(signInUserDto: SignInUserDto, privacyInfo: PrivacyInfo): Promise<any> {
        const user = await this.validateUser(signInUserDto);
        const userSession = await this.createUserSession(user, privacyInfo);

        await this.sendLoginNotificationEmail(signInUserDto.email, privacyInfo);

        return {
            user,
            userSession,
        };
    }

    private async createUserSession(user: UsersEntity, privacyInfo: PrivacyInfo): Promise<UserSessionsEntity> {
        const userSession: UserSessionsEntity = {
            id: uuid.v4(),
            userId: user.id,
            privacyInfo,
        };

        await this.redisRepository.set(userSession.id, JSON.stringify(userSession), 'EX', 24 * 60 * 60); // s: 24h * 60m * 60s

        return userSession;
    }

    public async validateUser(signInUserDto: SignInUserDto): Promise<UsersEntity> {
        const user = await this.usersService.getUserByEmail(signInUserDto.email);

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const isComparedPasswords = await bcryptjs.compare(signInUserDto.password, user.password);

        if (!isComparedPasswords) {
            throw new UnauthorizedException('Wrong password.');
        }

        return user;
    }

    public async signOutUser(currentSessionId: string): Promise<void> {
        await this.redisRepository.del(currentSessionId);
    }

    private sendLoginNotificationEmail(userEmail: string, privacyInfo: PrivacyInfo): Promise<SentMessageInfo> {
        return this.mailerService.sendMail({
            to: userEmail,
            subject: `Security alert for ${userEmail}`,
            html: `
                <div style="font-family:Helvetica;">
                    <h2>
                        A new sign-in
                    </h2>
                    <p style="font-size:16px;">
                        We noticed a new sign-in to your Chirik Account. If this was you, you don’t need to do anything. If not, take care of your account security.
                    </p>
                    <div style="font-size:16px; font-style: italic;">
                        Ip Address: ${privacyInfo.ipAddress}
                        <br>
                        User Agent: ${privacyInfo.userAgent}
                    </div>
                    <br>
                </div>
            `,
            from: 'Chirik <alex-mailer@mail.ru>',
        });
    }

    private sendConfirmationEmail(userEmail: string, verificationCode: string): Promise<SentMessageInfo> {
        return this.mailerService.sendMail({
            to: userEmail,
            subject: `${verificationCode} is your Chirik verification code`,
            html: `
                <div style="font-family:Helvetica;">
                    <h2>
                        Confirm your email address
                    </h2>
                    <p style="font-size:16px;">
                        There’s one quick step you need to complete before creating your Twitter account. Let’s make sure this is the right email address for you – please confirm this is the right address to use for your new account.
                    </p>
                    <p style="font-size:16px;">
                        Please enter this verification code to get started on Chirik:
                    </p>
                    <div style="font-size:32px; font-weight:bold;">
                        ${verificationCode}
                    </div>
                    <div style="font-family:Helvetica; font-size:14px;">
                        Verification codes expire after two hours
                    </div>
                    <div style="font-size:16px; margin-top:24px;">
                        Thanks,
                        <br>    
                        Chirik
                    </div>
                    <br>
                    <br>
                    <span style="margin-bottom:32px; color:#8899a6; font-size: 12px; text-align: center;">
                        Chirik, Inc.
                    </span>
                    <br>
                </div>
            `,
            from: 'Chirik <alex-mailer@mail.ru>',
        });
    }
}
