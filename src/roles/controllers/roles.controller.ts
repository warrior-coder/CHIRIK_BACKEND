import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { UsersService } from 'src/users/services/users.service';

import { CreateRoleDto } from '../dto/create-role.dto';
import { RolesService } from '../services/roles.service';

@Controller('/roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

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
    public deleteRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
        return this.rolesService.deleteRole(roleId);
    }

    @Post('/:roleId/for-user/:userId')
    public setRoleForUser(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.rolesService.setRoleForUser(roleId, userId);
    }

    @Get('/user/:userId')
    public getUserRoles(@Param('userId', ParseIntPipe) userId: number) {
        return this.rolesService.getUserRoles(userId);
    }
}
