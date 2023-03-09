import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@app/auth';

import { UsersService } from '../services/users.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/all')
    public getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('/:userId')
    public getUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.usersService.getUser(userId);
    }

    @Delete('/:userId')
    public deleteUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.usersService.getUser(userId);
    }
}
