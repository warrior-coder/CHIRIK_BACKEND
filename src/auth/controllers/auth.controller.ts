import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { PrivacyInfoDecorator } from 'src/decorators/privacy-info.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UsersEntity } from 'src/users/entities/users.entity';

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

        console.log(signUpUserDto);

        return this.authService.registerUser(signUpUserDto, privacyInfo, ['user']);
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

    @UseGuards(AuthGuard)
    @Get('/sessions/all')
    public getAllUserSessions(@CurrentUserDecorator() currentUser: UsersEntity) {
        return this.authService.getAllUserSessions(currentUser);
    }

    @UseGuards(AuthGuard)
    @Delete('/sessions/:sessionId')
    public async deleteSession(@Param('sessionId') sessionId: string) {
        const session = await this.authService.getSessionById(sessionId);

        return this.authService.deleteSession(session);
    }

    @UseGuards(AuthGuard)
    @Delete('/sessions/all')
    public deleteAllUserSession(@CurrentUserDecorator() currentUser: UsersEntity) {
        return this.authService.deleteAllUserSessions(currentUser);
    }
}
