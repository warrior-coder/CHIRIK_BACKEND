import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { UsersService } from 'src/users/services/users.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('/roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService, private readonly usersService: UsersService) {}

    @Get('/')
    public getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    @Get('/default')
    public getDefaultRole() {
        return this.rolesService.getDefaultRole();
    }

    @Get('/:roleId')
    public getRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
        return this.rolesService.getRoleById(roleId);
    }

    @Post('/')
    public createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.createRole(createRoleDto);
    }

    @Delete('/:roleId')
    public async deleteRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
        const role = await this.rolesService.getRoleById(roleId);

        return this.rolesService.deleteRole(role);
    }

    @Post('/:roleId/for-user/:userId')
    public async setRoleForUser(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        const role = await this.rolesService.getRoleById(roleId);
        const user = await this.usersService.getUserById(userId);

        return this.rolesService.setRoleForUser(role, user);
    }
}
