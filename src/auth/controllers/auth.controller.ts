import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';

import { CurrentSessionIdDecorator } from 'src/auth/decorators/current-session-id-decorator.decorator';
import { PrivacyInfoDecorator } from 'src/auth/decorators/privacy-info.decorator';
import { ValidationPipe } from 'src/pipes/validation.pipe';

import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { VerificationCodeDto } from '../dto/verification-code.dto';
import { PrivacyInfo } from '../interfaces/privacy-info.interface';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
        const user = await this.authService.confirmEmailAndRegisterUser(verificationCodeDto, privacyInfo, response);

        response.send(user);
    }

    @Post('/sign-in')
    public async signInUser(
        @Body() signInUserDto: SignInUserDto,
        @PrivacyInfoDecorator() privacyInfo: PrivacyInfo,
        @Res() response: Response,
    ) {
        const user = await this.authService.signInUser(signInUserDto, privacyInfo, response);

        response.send(user);
    }

    @Post('/sign-out')
    public async signOutUser(@CurrentSessionIdDecorator() currentSessionId: string, @Res() response: Response) {
        await this.authService.signOutUser(currentSessionId, response);

        response.end();
    }
}
