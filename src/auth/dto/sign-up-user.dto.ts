import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpUserDto {
    @IsString()
    @Length(4, 32)
    readonly name: string;

    @IsString()
    @IsEmail()
    @Length(4, 64)
    readonly email: string;

    @IsString()
    @Length(4, 32)
    readonly password: string;
}
