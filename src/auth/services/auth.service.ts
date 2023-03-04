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
        await this.cacheManager.set(verificationCode, signUpUserDto);

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

    public async registerUser(signUpUserDto: SignUpUserDto, rolesValues: string[]): Promise<UserEntityWithJwtPair> {
        const hashedPassword = await bcryptjs.hash(signUpUserDto.password, 4);
        const user = await this.usersService.createUser({
            ...signUpUserDto,
            password: hashedPassword,
        });
        const userRoles = await this.createUserRoles(user, rolesValues);
        const accessToken = this.createAccessToken(user, userRoles);
        const refreshToken = await this.createRefreshToken(user);

        return {
            user,
            accessToken,
            refreshToken: refreshToken.value,
        };
    }

    public async signInUser(signInUserDto: SignInUserDto, privacyInfo: PrivacyInfo): Promise<UserEntityWithJwtPair> {
        const user = await this.validateUser(signInUserDto);
        const userRoles = await this.usersRolesRepository
            .createQueryBuilder('users_roles')
            .where(`users_roles."userId" = :userId`, { userId: user.id })
            .getMany();
        const accessToken = this.createAccessToken(user, userRoles);
        const refreshToken = await this.createRefreshToken(user);

        await this.sendLoginNotificationEmail(signInUserDto.email, privacyInfo);

        return {
            user,
            accessToken,
            refreshToken: refreshToken.value,
        };
    }

    private mapUserRolesToRolesValues(userRoles: UsersRolesEntity[]): string[] {
        return userRoles.map((userRole: UsersRolesEntity): string => userRole.roleValue);
    }

    private async createUserRoles(user: UsersEntity, rolesValues: string[]): Promise<UsersRolesEntity[]> {
        const userRoles: UsersRolesEntity[] = await Promise.all(
            rolesValues.map(async (roleValue: string): Promise<UsersRolesEntity> => {
                const userRole = this.usersRolesRepository.create({
                    user,
                    roleValue,
                });

                await this.usersRolesRepository.save(userRole);

                return userRole;
            }),
        );

        return userRoles;
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

    public async signOutUser(refreshTokenValue: string): Promise<RefreshTokensEntity> {
        const refreshToken = await this.refreshTokensRepository.findOneBy({ value: refreshTokenValue });

        return this.refreshTokensRepository.remove(refreshToken);
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

    private createAccessToken(user: UsersEntity, userRoles: UsersRolesEntity[]): string {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const rolesValues = this.mapUserRolesToRolesValues(userRoles);
        const payload = {
            userId: user.id,
            userRolesValues: rolesValues,
        };
        const accessToken = this.jwtService.sign(payload);

        return accessToken;
    }

    private createRefreshToken(user: UsersEntity): Promise<RefreshTokensEntity> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const refreshToken = this.refreshTokensRepository.create({
            value: uuid.v4(),
            user,
        });

        return this.refreshTokensRepository.save(refreshToken);
    }

    public async getNewAccessToken(refreshTokenValue: string) {
        const refreshToken = await this.refreshTokensRepository.findOneBy({ value: refreshTokenValue });

        if (!refreshToken) {
            throw new UnauthorizedException('refresh token not exist');
        }

        if (refreshToken.value !== refreshTokenValue) {
            throw new UnauthorizedException('invalid refresh token');
        }

        const user = await this.usersService.getUserById(refreshToken.user.id);
        const userRoles = await this.usersRolesRepository.findBy({ user });
        const accessToken = this.createAccessToken(user, userRoles);

        refreshToken.value = uuid.v4();
        this.refreshTokensRepository.save(refreshToken);

        return {
            accessToken,
            refreshToken: refreshToken.value,
        };
    }
}
