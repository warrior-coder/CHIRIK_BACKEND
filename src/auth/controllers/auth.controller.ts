import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';

import { CurrentSessionIdDecorator } from 'src/auth/decorators/current-session-id-decorator.decorator';
import { PrivacyInfoDecorator } from 'src/auth/decorators/privacy-info.decorator';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { UsersRolesEntity } from 'src/roles/entities/users-roles.entity';
import { RolesService } from 'src/roles/roles.service';

import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { VerificationCodeDto } from '../dto/verification-code.dto';
import { PrivacyInfo } from '../interfaces/privacy-info.interface';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly rolesService: RolesService) {}

    @UsePipes(ValidationPipe)
    @Post('/sign-up')
    public signUpUser(@Body() signUpUserDto: SignUpUserDto) {
        return this.authService.signUpUser(signUpUserDto);
    }

    @Post('/confirm-email')
    public async confirmEmailAndRegisterUser(
        @Body() verificationCodeDto: VerificationCodeDto,
        @PrivacyInfoDecorator() privacyInfo: PrivacyInfo,
        @Res() response: Response,
    ) {
        const signUpUserDto = await this.authService.confirmEmailAndGetSignUpUserDto(verificationCodeDto.value);
        const { user, userSession } = await this.authService.registerUser(signUpUserDto, privacyInfo);
        const defaultRole: RolesEntity = await this.rolesService.getDefaultRole();
        const userRole: UsersRolesEntity = await this.rolesService.setRoleForUser(defaultRole, user);

        response.cookie('SESSION_ID', userSession.id, {
            expires: new Date(new Date().getTime() + 10 * 60 * 1000),
            sameSite: 'strict',
            httpOnly: true,
        });

        return response.send(user);
    }

    @Post('/sign-in')
    public async signInUser(
        @Body() signInUserDto: SignInUserDto,
        @PrivacyInfoDecorator() privacyInfo: PrivacyInfo,
        @Res() response: Response,
    ) {
        const obj = await this.authService.signInUser(signInUserDto, privacyInfo);

        response.cookie('SESSION_ID', obj.userSession.id, {
            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // ms: 24h * 60m * 60s * 1000ms
            sameSite: 'strict',
            httpOnly: true,
        });

        return response.send(obj.user);
    }

    @Post('/sign-out')
    public async signOutUser(@CurrentSessionIdDecorator() currentSessionId: string, @Res() response: Response) {
        response.clearCookie('SESSION_ID');

        await this.authService.signOutUser(currentSessionId);

        response.end();
    }
}
