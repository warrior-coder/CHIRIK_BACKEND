import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';

import { PrivacyInfoDecorator } from 'src/decorators/privacy-info.decorator';
import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';
import { ValidationPipe } from 'src/pipes/validation.pipe';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { VerificationCodeDto } from '../dto/verification-code.dto';
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
    ) {
        const signUpUserDto = await this.authService.confirmEmailAndGetSignUpUserDto(verificationCodeDto.value);

        return this.authService.registerUser(signUpUserDto, ['user']);
    }

    @Post('/sign-in')
    public signInUser(@Body() signInUserDto: SignInUserDto, @PrivacyInfoDecorator() privacyInfo: PrivacyInfo) {
        return this.authService.signInUser(signInUserDto, privacyInfo);
    }

    @Post('/sign-out')
    public signOutUser(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.signOutUser(refreshTokenDto.value);
    }

    @Get('/new-access-token')
    public getNewAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.getNewAccessToken(refreshTokenDto.value);
    }
}
