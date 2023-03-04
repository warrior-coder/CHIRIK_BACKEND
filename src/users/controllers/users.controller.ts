import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { get } from 'http';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/all')
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('/current')
    public getCurrentUser(@CurrentUserDecorator() currentUser: UsersEntity) {
        return currentUser;
    }

    @Get('/:userId')
    public getUserById(@Param('userId') userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Delete('/:userId')
    public async deleteUser(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.usersService.deleteUser(user);
    }

    @UseGuards(AuthGuard)
    @Get('/:userId/profile-images')
    public async getUserProfileImages(@Param('userId') userId: string) {
        const user = await this.usersService.getUserById(userId);

        return this.usersService.getUserProfileImages(user);
    }
}
