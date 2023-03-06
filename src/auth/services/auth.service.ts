import { MailerService } from '@nestjs-modules/mailer';
import {
    BadRequestException,
    CACHE_MANAGER,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { SentMessageInfo } from 'nodemailer';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';

import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';
import { UserEntityWithJwtPair } from 'src/interfaces/user-entity-with-jwt-pair.interface';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';

import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { UsersRolesEntity } from '../entities/users-roles.entity';
import { UserSessionsEntity } from '../entities/users-session.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokensEntity)
        private readonly refreshTokensRepository: Repository<RefreshTokensEntity>,
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectRepository(UsersRolesEntity)
        private readonly usersRolesRepository: Repository<UsersRolesEntity>,
    ) {}

    public async signUpUser(signUpUserDto: SignUpUserDto): Promise<SentMessageInfo> {
        const candidateUser = await this.usersService.getUserByEmail(signUpUserDto.email);
        if (candidateUser) {
            throw new BadRequestException('user already exists');
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');
        await this.cacheManager.set(verificationCode, signUpUserDto, 1 * 60 * 60);

        return this.sendConfirmationEmail(signUpUserDto.email, verificationCode);
    }

    public async confirmEmailAndGetSignUpUserDto(verificationCode: string): Promise<SignUpUserDto> {
        const signUpUserDto = await this.cacheManager.get<SignUpUserDto>(verificationCode);

        if (!signUpUserDto) {
            throw new BadRequestException('invalid verification code');
        }

        await this.cacheManager.del(verificationCode);

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

        await this.cacheManager.set(userSession.id, userSession, 24 * 60 * 60); // s: 24h * 60m * 60s

        return userSession;
    }

    public async validateUser(signInUserDto: SignInUserDto): Promise<UsersEntity> {
        const user = await this.usersService.getUserByEmail(signInUserDto.email);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const isComparedPasswords = await bcryptjs.compare(signInUserDto.password, user.password);

        if (!isComparedPasswords) {
            throw new UnauthorizedException('wrong password');
        }

        return user;
    }

    public signOutUser(currentSessionId: string): Promise<void> {
        return this.cacheManager.del(currentSessionId);
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
                        We noticed a new sign-in to your Twitter Account. If this was you, you don’t need to do anything. If not, take care of your account security.
                    </p>
                    <div style="font-size:16px; font-style: italic;">
                        Ip Address: ${privacyInfo.ipAddress}
                        <br>
                        User Agent: ${privacyInfo.userAgent}
                    </div>
                    <br>
                </div>
            `,
            from: 'Twitter <alex-mailer@mail.ru>',
        });
    }

    private sendConfirmationEmail(userEmail: string, verificationCode: string): Promise<SentMessageInfo> {
        return this.mailerService.sendMail({
            to: userEmail,
            subject: `${verificationCode} is your Twitter verification code`,
            html: `
                <div style="font-family:Helvetica;">
                    <h2>
                        Confirm your email address
                    </h2>
                    <p style="font-size:16px;">
                        There’s one quick step you need to complete before creating your Twitter account. Let’s make sure this is the right email address for you – please confirm this is the right address to use for your new account.
                    </p>
                    <p style="font-size:16px;">
                        Please enter this verification code to get started on Twitter:
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
                        Twitter
                    </div>
                    <br>
                    <br>
                    <span style="margin-bottom:32px; color:#8899a6; font-size: 12px; text-align: center;">
                        Twitter, Inc.
                    </span>
                    <br>
                </div>
            `,
            from: 'Twitter <alex-mailer@mail.ru>',
        });
    }
}
