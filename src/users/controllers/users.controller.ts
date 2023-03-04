import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';

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
    public getUserById(@Param('userId', ParseIntPipe) userId: number) {
        return this.usersService.getUserById(userId);
    }

    @Delete('/:userId')
    public async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
        const user = await this.usersService.getUserById(userId);

        return this.usersService.deleteUser(user);
    }
}
